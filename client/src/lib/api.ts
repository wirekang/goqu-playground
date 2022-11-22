export interface ApiRequest {
  dialect: string;
  before: string;
  exp: string;
  after: string;
  var_name: {
    db: string;
  };
}

export interface ApiResponse {
  sql: string;
}

export async function callApi(arg: ApiRequest): Promise<ApiResponse> {
  const r = await fetch(import.meta.env.VITE_SERVER_HOST, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await r.json();
  if (r.status !== 200 || !res.sql) {
    throw res.error;
  }

  return res;
}
