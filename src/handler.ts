import { version } from '../package.json';

// default responses
const responseInit = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
};
const badReqBody = {
  status: 400,
  statusText: 'Bad Request',
  ...responseInit,
};
const errReqBody = {
  status: 500,
  statusText: 'Internal Error',
  ...responseInit,
};
const noAuthReqBody = {
  status: 401,
  statusText: 'Unauthorized',
  ...responseInit,
};

/**
 * Handler method for all requests.
 * @function
 * @async
 *
 * @param {Request} request request object
 * @returns {Promise<Response>} response object
 */
export const handleRequest = async (request: Request): Promise<Response> => {
  // POST requests only
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ version }), {
      status: 405,
      statusText: 'Method Not Allowed',
    });
  }

  // content-type check (required)
  if (!request.headers.has('content-type')) {
    return new Response(
      JSON.stringify({
        error: "Please provide 'content-type' header.",
        version,
      }),
      badReqBody
    );
  }

  const contentType = request.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const payload: RequestPayload = await request.json();
    const data = {};

    try {
      // check for required fields
      switch (true) {
        case !payload.key:
          return new Response(
            JSON.stringify({ error: "Missing 'key' parameter.", version }),
            noAuthReqBody
          );
        case payload.key !== AUTH_KEY:
          return new Response(
            JSON.stringify({
              error: "You're not authorized to access this API.",
              version,
            }),
            noAuthReqBody
          );
        default: {
          return new Response(JSON.stringify({ data, version }), responseInit);
        }
      }
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error, version }), errReqBody);
    }
  }

  // default to bad content-type
  return new Response(JSON.stringify({ version }), {
    status: 415,
    statusText: 'Unsupported Media Type',
  });
};
