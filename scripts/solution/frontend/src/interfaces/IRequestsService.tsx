export interface IRequestsService {
  /**
   * API method - GET
   * @param apiPath API relative path
   * @param queryParams Key value string pairs to add as query parameters in the request
   */
  get(apiPath: string, headers?: Record<string, string>, queryParams?: Record<string, string>): Promise<Response>;

  /**
   * API method - DELETE
   * @param apiPath API relative path
   * @param queryParams Key value string pairs to add as query parameters in the request
   */
  delete(apiPath: string, headers?: Record<string, string>, queryParams?: Record<string, string>): Promise<Response>;

  /**
   * API method - POST
   * @param apiPath API relative path
   * @param body Request body
   * @param queryParams Key value string pairs to add as query parameters in the request
   * @param isExternal Variable that determinates if endpoint is external or internal
   */
  post(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response>;


  post_sse(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<ReadableStreamDefaultReader<string> | undefined >;

  /**
   * API method - PUT
   * @param apiPath API relative path
   * @param body Request body
   * @param queryParams Key value string pairs to add as query parameters in the request
   * @param isExternal Variable that determinates if endpoint is external or internal
   */
  put(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response>;

  /**
   * API method - PATCH
   * @param apiPath API relative path
   * @param body Request body
   * @param queryParams Key value string pairs to add as query parameters in the request
   */
  patch(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response>;
}