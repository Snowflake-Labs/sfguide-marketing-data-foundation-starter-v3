from api import app
from flask import request
from snowflake.snowpark.functions import col, lit, month, year, concat, monthname, to_date, round as round_, sum as sum_, iff, udf
from snowflake.snowpark import DataFrame
from utils.model_helpers import connect_to_snowflake
from globals import *

def format_num(num:float, prefix: str) -> str:
    sp_session = connect_to_snowflake()
    @udf(if_not_exists=True)
    def format_num_aux(num:float, prefix: str) -> str:
        if num >= 10**12:
            return f"{prefix} {(num / 10**12):.2f}T"
        elif num >= 10**9:
            return f"{prefix} {(num / 10**9):.2f}B"
        elif num >= 10**6:
            return f"{prefix} {(num / 10**6):.2f}M"
        elif num >= 1000:
            return f"{prefix} {(num / 1000):.2f}K"
        else:
            return f"{prefix} {round(num, 2)}"
    return format_num_aux(num, prefix)


def format_response(df: DataFrame):
    response = {}
    for column in df.columns:
        response[column.lower()] = [item[0] for item in df.select(col(column)).collect()]
        
    return response


@app.get("/api/data_explorer/spend")
def get_spend():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    spend_per_date =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .group_by(col(MONTH_YEAR_COLUMN), col(MONTH_COLUMN), col(YEAR_COLUMN), col(SORT_DATE_COLUMN)).agg(sum_(SPEND_COLUMN).alias(SPEND_COLUMN))\
                        .orderBy(col(SORT_DATE_COLUMN).asc())\
                        .na.fill(0)\
                        .select(col(MONTH_YEAR_COLUMN).alias(DATE_COLUMN), round_(col(SPEND_COLUMN),1).alias(VALUE_COL))
    
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .group_by([col(PLATFORM_NAME_COL), YEAR_COLUMN]).agg(sum_(col(SPEND_COLUMN)).alias(VALUE_COL))\
                        .orderBy(col(YEAR_COLUMN).asc())
                        
    list = []
    for row in df.collect():
        dict = {}
        dict[row[PLATFORM_NAME_COL]] = round(row[VALUE_COL.upper()],2)
        dict[YEAR_COLUMN.lower()] = row[YEAR_COLUMN]
        
        list.append(dict)

    spend_per_platform = {
        "dataset": list,
        "series": [{ 'dataKey': row[PLATFORM_NAME_COL], 'label': row[PLATFORM_NAME_COL]} for row in df.select(col(PLATFORM_NAME_COL)).distinct().collect()] 
    }

    spend_per_platform_total =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .group_by([col(PLATFORM_NAME_COL)]).agg(sum_(col(SPEND_COLUMN)).alias(VALUE_COL))\
                        .withColumnRenamed(col(PLATFORM_NAME_COL), NAME_KEY)

    
    
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .group_by([col(ACCOUNT_NAME_COL), YEAR_COLUMN]).agg(sum_(col(SPEND_COLUMN)).alias(VALUE_COL))\
                        .orderBy(col(YEAR_COLUMN).asc())
    list = []
    for row in df.collect():
        dict = {}
        dict[row[ACCOUNT_NAME_COL]] = round(row[VALUE_COL.upper()],2)
        dict[YEAR_COLUMN.lower()] = row[YEAR_COLUMN]
        
        list.append(dict)

    spend_per_account = {
        "dataset": list,
        "series": [{ 'dataKey': row[ACCOUNT_NAME_COL], 'label': row[ACCOUNT_NAME_COL]} for row in df.select(col(ACCOUNT_NAME_COL)).distinct().collect()] 
    }

    overall_spend =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .select(format_num(sum_(col(SPEND_COLUMN)), lit("$ ")).alias(VALUE_COL))
    
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .group_by([col(ACCOUNT_NAME_COL)]).agg(round_(sum_(col(SPEND_COLUMN)),2).alias(SPEND_COLUMN))
    data = []
    overall_spend_per_account = {}
    for row in df.collect():
        dict = {}
        dict[NAME_KEY.lower()] = row[ACCOUNT_NAME_COL]
        dict[SPEND_COLUMN.lower()] = row[SPEND_COLUMN]
        data.append(dict)
    overall_spend_per_account["data"] =data
    overall_spend_per_account["columns"] = ['Spend']


    
    return {"spend_per_date": format_response(spend_per_date),
            "spend_per_platform": spend_per_platform,
            "spend_per_platform_total": format_response(spend_per_platform_total),
            "spend_per_account": spend_per_account,
            "overall_spend": format_response(overall_spend),
            "overall_spend_per_account": overall_spend_per_account
            }


@app.get("/api/data_explorer/reactions")
def get_reactions():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    reactions_per_date =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .group_by(col(MONTH_YEAR_COLUMN), col(MONTH_COLUMN), col(YEAR_COLUMN), col(SORT_DATE_COLUMN)).agg(sum_(CLICKS_COLUMN).alias(CLICKS_COLUMN))\
                        .orderBy(col(SORT_DATE_COLUMN).asc())\
                        .na.fill(0)\
                        .select(col(MONTH_YEAR_COLUMN).alias(DATE_COLUMN), round_(col(CLICKS_COLUMN),1).alias(VALUE_COL))
    overall_reactions =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .select(format_num(sum_(col(CLICKS_COLUMN)), lit('')).alias(VALUE_COL))
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                       .group_by([col(AD_GROUP_NAME_COL)]).agg(sum_(col(CLICKS_COLUMN)).alias(REACTIONS))\
                       .orderBy(col(REACTIONS), ascending=False)\
                       .limit(5)
    data = []
    top_ad_group_reactions = {}
    for row in df.collect():
        dict = {}
        dict[NAME_KEY.lower()] = row[AD_GROUP_NAME_COL]
        dict[REACTIONS.lower()] = row[REACTIONS]
        data.append(dict)
    top_ad_group_reactions["data"] =data
    top_ad_group_reactions["columns"] = ['Reactions']

    return {"reactions_per_date": format_response(reactions_per_date),
            "overall_reactions": format_response(overall_reactions),
            "top_ad_group_reactions": top_ad_group_reactions
            }


@app.get("/api/data_explorer/impressions")
def get_impressions():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .group_by([col(PLATFORM_NAME_COL), YEAR_COLUMN]).agg(sum_(col(IMPRESSIONS_COL)).alias(VALUE_COL))\
                        .orderBy(col(YEAR_COLUMN).asc())
    list = []
    for row in df.collect():
        dict = {}
        dict[row[PLATFORM_NAME_COL]] = round(row[VALUE_COL.upper()],2)
        dict[YEAR_COLUMN.lower()] = row[YEAR_COLUMN]
        
        list.append(dict)

    impressions_per_platform = {
        "dataset": list,
        "series": [{ 'dataKey': row[PLATFORM_NAME_COL], 'label': row[PLATFORM_NAME_COL]} for row in df.select(col(PLATFORM_NAME_COL)).distinct().collect()] 
    }

    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .group_by([col(AD_GROUP_NAME_COL)]).agg(sum_(col(IMPRESSIONS_COL)).alias(IMPRESSIONS_COL))\
                        .orderBy(col(IMPRESSIONS_COL), ascending=False)\
                        .limit(5)
    data = []
    top_ad_group_impressions = {}
    for row in df.collect():
        dict = {}
        dict[NAME_KEY.lower()] = row[AD_GROUP_NAME_COL]
        dict[IMPRESSIONS_COL.lower()] = row[IMPRESSIONS_COL]
        data.append(dict)
    top_ad_group_impressions["data"] =data
    top_ad_group_impressions["columns"] = ['Impressions']

    return {"impressions_per_platform": impressions_per_platform,
            "top_ad_group_impressions": top_ad_group_impressions
            }





@app.get("/api/data_explorer/combined_metrics")
def get_combined_metrics():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    avg_spend_per_reaction =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .agg(sum_(SPEND_COLUMN).alias(SPEND_COLUMN), sum_(CLICKS_COLUMN).alias(CLICKS_COLUMN))\
                        .na.fill(0)\
                        .withColumn(SPEND_PER_CLICKS_COLUMN, iff(col(CLICKS_COLUMN)== lit(0), lit(0), col(SPEND_COLUMN) / col(CLICKS_COLUMN)))\
                        .select(format_num(col(SPEND_PER_CLICKS_COLUMN),lit('')).alias(VALUE_COL))
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        .group_by([col(CAMPAIGN_NAME_COL)]).agg(round_(sum_(col(SPEND_COLUMN))/ sum_(col(CLICKS_COLUMN)), 2).alias(SPEND_PER_CLICK))\
                        .orderBy(col(SPEND_PER_CLICK), ascending=False)\
                        .limit(5) 
    data = []
    top_campaigns_spend_per_click = {}
    for row in df.collect():
        dict = {}
        dict[NAME_KEY.lower()] = row[CAMPAIGN_NAME_COL]
        dict[SPEND_PER_CLICK.lower()] = row[SPEND_PER_CLICK]
        data.append(dict)
    top_campaigns_spend_per_click["data"] =data
    top_campaigns_spend_per_click["columns"] = ['Spend Per Click']

    spend_per_reactions =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .withColumn(MONTH_YEAR_COLUMN,concat(monthname(DATE_COLUMN),lit("-"), 
                                                             year(DATE_COLUMN)))\
                        .withColumn(MONTH_COLUMN, month(DATE_COLUMN))\
                        .withColumn(YEAR_COLUMN, year(DATE_COLUMN))\
                        .withColumn(SORT_DATE_COLUMN, to_date(concat(col(YEAR_COLUMN), lit("-"), col(MONTH_COLUMN)), "yyyy-MM"))\
                        \
                        .group_by(col(MONTH_YEAR_COLUMN), col(MONTH_COLUMN), col(YEAR_COLUMN), col(SORT_DATE_COLUMN)).agg(sum_(SPEND_COLUMN).alias(SPEND_COLUMN), sum_(CLICKS_COLUMN).alias(CLICKS_COLUMN))\
                        .orderBy(col(SORT_DATE_COLUMN).asc())\
                        .na.fill(0)\
                        .withColumn(SPEND_PER_CLICKS_COLUMN, iff(col(CLICKS_COLUMN)== lit(0), lit(0), col(SPEND_COLUMN) / col(CLICKS_COLUMN)))\
                        .select(col(MONTH_YEAR_COLUMN).alias(DATE_COLUMN), round_(col(SPEND_PER_CLICKS_COLUMN),1).alias(VALUE_COL))
    
    df =  sp_session.table([database, schema, CAMPAIGN_PERFORMANCE])\
                        .group_by([col(PLATFORM_NAME_COL)]).agg(round_(sum_(col(SPEND_COLUMN)),2).alias(SPEND_COLUMN),
                                                                 round_(sum_(IMPRESSIONS_COL)).alias(IMPRESSIONS_COL))
    data = []
    overall_spend_impressions_per_platform = {}
    for row in df.collect():
        dict = {}
        dict[NAME_KEY.lower()] = row[PLATFORM_NAME_COL]
        dict[SPEND_COLUMN.lower()] = row[SPEND_COLUMN]
        dict[IMPRESSIONS_COL.lower()] = row[IMPRESSIONS_COL]
        data.append(dict)
    overall_spend_impressions_per_platform["data"] =data
    overall_spend_impressions_per_platform["columns"] = ['Spend', 'Impressions']


    return {"avg_spend_per_reaction": format_response(avg_spend_per_reaction),
            "top_campaigns_spend_per_click": top_campaigns_spend_per_click,
            "spend_per_reactions": format_response(spend_per_reactions),
            "overall_spend_impressions_per_platform":overall_spend_impressions_per_platform
            }

# Customer 360 Data
    
@app.get("/api/data_explorer/get_country_group")
def get_country_group():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df = sp_session.sql("""select geo_country, count(*) as counts from {0}.{1}.{2} group by geo_country --having counts > 5000 
                        order by counts desc ;""".format(database, schema, C360_TABLE )).to_pandas()
    return df.to_json(orient="records")


@app.get("/api/data_explorer/get_country_lat")
def get_country_lat():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df = sp_session.sql("select LAT as LATITUDE, LNG  as longitude, count(*) as counts from {0}.{1}.{2} group by latitude, longitude having counts > 5000 order by counts desc ;".format(database, schema, C360_TABLE)).to_pandas()
    return df

@app.get("/api/data_explorer/get_overall_users")
def get_overall_users():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    overall_user_counts = sp_session.sql("WITH UserInfo AS ( \
    SELECT user_pseudo_id, MAX(iff(event_name IN ('first_visit', 'first_open'), 1, 0)) AS is_new_user FROM {0}.{1}.{2} \
    GROUP BY 1) SELECT COUNT(*) AS user_count, SUM(is_new_user) AS new_user_count FROM UserInfo;".format(database, schema, C360_TABLE)).collect()[0][0]
    return overall_user_counts


def get_overall_users_last_n_days(sp_session, database, schema):
    overall_user_counts = sp_session.sql("WITH UserInfo AS ( \
    SELECT user_pseudo_id, MAX(iff(event_name IN ('first_visit', 'first_open'), 1, 0)) AS is_new_user FROM {0}.{1}.{2} \
    GROUP BY 1) SELECT COUNT(*) AS user_count, SUM(is_new_user) AS new_user_count FROM UserInfo;".format(database, schema, C360_TABLE)).collect()[0][1]
    return overall_user_counts

def get_revenue_last_n_days(sp_session, database, schema,day_since):
    user_counts = sp_session.sql("select sum(user_ltv_revenue) as revenue from {0}.{1}.{2} where event_date > dateadd(day, -{3}, current_date());".format(database, schema, C360_TABLE, day_since)).collect()[0][0]
    return user_counts

def get_session_count(sp_session, database, schema):
    sess_count = sp_session.sql("SELECT event_name, COUNT(*) AS event_count FROM {0}.{1}.{2} WHERE event_name IN ('session_start') GROUP BY 1".format(database, schema, C360_TABLE)).collect()[0][1]
    return sess_count

def get_total_page_view(sp_session, database, schema):
    tot_page_view = sp_session.sql("WITH UserInfo AS ( SELECT user_pseudo_id, count_if(event_name = 'page_view') AS page_view_count, count_if(event_name IN ('user_engagement', 'purchase')) AS purchase_event_count FROM {0}.{1}.{2} GROUP BY 1) select SUM(page_view_count) AS total_page_views, SUM(page_view_count) / COUNT(*) AS avg_page_views FROM UserInfo;".format(database, schema, C360_TABLE)).collect()[0]
    return tot_page_view


@app.get("/api/data_explorer/get_purchase_time")
def get_purchase_time():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df_out = sp_session.sql("SELECT event_date, iff(avg(iff(COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value)::int = COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value), COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value), 0))/(60*60) > 60000, 60000, avg(iff(COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value)::int = COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value), COALESCE(v.value:value:int_value, v.value:value:float_value, v.value:value:double_value), 0))/(60*60)) AS AVG_TIME_SPENT FROM {0}.{1}.{2}, LATERAL FLATTEN( INPUT => EVENT_PARAMS_UTMS ) v WHERE event_name = 'user_engagement' group by 1 order by AVG_TIME_SPENT desc;".format(database, schema, C360_TABLE)).to_pandas()
    return df_out.to_json(orient="records")


def get_page_views(sp_session, database, schema):
    view_count = sp_session.sql("SELECT event_name, COUNT(*) AS event_count FROM {0}.{1}.{2} WHERE event_name IN ('page_view') GROUP BY 1".format(database, schema, C360_TABLE)).collect()[0][1]
    return view_count

def get_avg_session_per_user(sp_session, database, schema):
    avg_session_per_user = sp_session.sql("with data as (SELECT user_pseudo_id, EVENT_PARAMS_UTMS[0]:key::varchar as key, count(*) as counts_per_user FROM {0}.{1}.{2} WHERE key = 'ga_session_id' group by 1,2) select sum(counts_per_user)/count(*) as avg_session_per_user from data;".format(database, schema, C360_TABLE)).collect()[0][0]
    if isinstance(avg_session_per_user, int):
        return avg_session_per_user
    else:
        return 0



def get_page_view_per_user(sp_session, database, schema):
    page_view_per_user = sp_session.sql("with data as ( SELECT user_pseudo_id, event_name, count(*) as counts_per_user FROM {0}.{1}.{2} WHERE event_name = 'page_view' group by 1,2) select sum(counts_per_user)/count(*) as avg_page_view_per_user from data ;".format(database, schema, C360_TABLE)).collect()[0][0]
    return page_view_per_user


@app.get("/api/data_explorer/get_device_type")
def get_device_type():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df_device_type = sp_session.sql("with data as ( select event_date, DEVICE_CATEGORY, count(*) as counts from {0}.{1}.{2} group by 1, 2) SELECT EVENT_DATE, ifnull(\"'tablet'\", 0) AS TABLET,  ifnull(\"'mobile'\",0) AS MOBILE, ifnull(\"'desktop'\",0) AS DESKTOP, ifnull(\"'smart tv'\",0) AS SMART_TV FROM data PIVOT(SUM(counts) FOR DEVICE_CATEGORY IN ('tablet', 'mobile', 'desktop', 'smart tv')) AS p ORDER BY EVENT_DATE;".format(database, schema, C360_TABLE)).to_pandas()
    return df_device_type.to_json(orient="records")

@app.get("/api/data_explorer/get_browser_type")
def get_browser_type():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df_browser_type = sp_session.sql("with data as ( select event_date, DEVICE_WEB_INFO_BROWSER, count(*) as counts from {0}.{1}.{2} group by 1, 2) SELECT EVENT_DATE, ifnull(\"'Chrome'\", 0) AS CHROME,  ifnull(\"'Edge'\",0) AS EDGE, ifnull(\"'Safari'\",0) AS SAFARI, ifnull(\"'Firefox'\",0) AS FIREFOX FROM data PIVOT(SUM(counts) FOR DEVICE_WEB_INFO_BROWSER IN ('Chrome', 'Edge', 'Safari', 'Firefox')) AS p ORDER BY EVENT_DATE;".format(database, schema, C360_TABLE)).to_pandas()
    return df_browser_type.to_json(orient="records")

@app.get("/api/data_explorer/get_status_counts")
def get_status_counts():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    df_status = sp_session.sql("with data as (SELECT status, UTM_SOURCE, count(distinct USER_PSEUDO_ID) as counts FROM {0}.{1}.{2} group by status,UTM_SOURCE having status != 'NULL') select * from data;".format(database, schema, C360_TABLE)).to_pandas()
    return df_status.to_json(orient="records")

def get_overall_engagements(sp_session, database, schema):
    overall_engagements = sp_session.sql("select count(distinct USER_PSEUDO_ID) as counts from {0}.{1}.{2} where event_name in ('session_start','user_engagement','click','page_view','Searched the Community','first_visit','view_search_results','scroll');".format(database, schema, C360_TABLE)).collect()[0][0]
    return overall_engagements

def get_user_attended(sp_session, database, schema):
    user_attended = sp_session.sql("select count(distinct USER_PSEUDO_ID) as counts from {0}.{1}.{2} where status in ('Attended', 'Attended On-demand');".format(database, schema, C360_TABLE)).collect()[0][0]
    return user_attended

def get_user_registered(sp_session, database,schema):
    user_attended = sp_session.sql("select count(distinct USER_PSEUDO_ID) as counts from {0}.{1}.{2} where status in ('Attended', 'Attended On-demand','Registered','No Show');".format(database, schema, C360_TABLE)).collect()[0][0]
    return user_attended

@app.get("/api/data_explorer/get_webinar_metrics")
def get_webinar_metrics():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    overall_engagements = get_overall_engagements(sp_session, database, schema)
    user_attended = get_user_attended(sp_session, database, schema)
    user_registered = get_user_registered(sp_session, database, schema) 
    website_conversions = round((user_registered/overall_engagements)*100,2)
    attendance = round((user_attended/overall_engagements)*100,2)
    return {"overall_engagements": overall_engagements, "user_attended": user_attended, "user_registered": user_registered, "website_conversions": website_conversions, "attendance": attendance}

@app.get("/api/data_explorer/get_customers_overview")
def get_customers_overview():
    sp_session = connect_to_snowflake()
    database = request.headers["database"]
    schema = request.headers["schema"]
    days = request.headers["days"]
    overall_users = get_overall_users()
    overall_users_last_n_days = get_overall_users_last_n_days(sp_session, database, schema)
    revenue_last_days = get_revenue_last_n_days(sp_session, database, schema, days)
    session_count = get_session_count(sp_session, database, schema)
    total_page_view = get_total_page_view(sp_session, database, schema)
    page_views = get_page_views(sp_session, database, schema)
    avg_session_per_user = get_avg_session_per_user(sp_session, database, schema)
    page_view_per_user = get_page_view_per_user(sp_session, database, schema)
    return {"overall_users": overall_users, "overall_users_last_n_days": overall_users_last_n_days, "revenue_last_days": revenue_last_days, "session_count": session_count, "total_page_view": total_page_view, "page_views": page_views, "avg_session_per_user": avg_session_per_user, "page_view_per_user": page_view_per_user}
