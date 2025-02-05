import { IRequestsService } from 'interfaces/IRequestsService';
import { injectable } from 'inversify';

@injectable()
export class RequestsService implements IRequestsService {
  private constructURL(apiPath: string, queryParams?: Record<string, string>): string {
    let url = apiPath;
    if (queryParams) {
      const searchParams = new URLSearchParams(queryParams);
      url = `${url}?${searchParams.toString()}`;
    }
    return url;
  }

  get(apiPath: string, headers?: Record<string, string>, queryParams?: Record<string, string>): Promise<Response> {
    return fetch(this.constructURL(apiPath, queryParams), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  delete(
    apiPath: string,
    headers?: Record<string, string>,
    queryParams?: Record<string, string> | undefined
  ): Promise<Response> {
    return fetch(this.constructURL(apiPath, queryParams), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  post(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response> {
    return fetch(this.constructURL(apiPath, queryParams), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    });
  }


  async post_sse(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<ReadableStreamDefaultReader<string> | undefined >{
    const response = await fetch(this.constructURL(apiPath, queryParams), {
      method: 'POST',
      headers: {
       'Content-Type': 'text/event-stream',
        ...headers,
      },
      body,
    });
    return response?.body?.pipeThrough(new TextDecoderStream()).getReader()
  }


  put(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response> {
    return fetch(this.constructURL(apiPath, queryParams), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    });
  }

  patch(
    apiPath: string,
    body: BodyInit,
    headers?: Record<string, string>,
    queryParams?: Record<string, string>
  ): Promise<Response> {
    return fetch(this.constructURL(apiPath, queryParams), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    });
  }
}
