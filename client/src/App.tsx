import "./App.css";
import { useState } from "react";
import { ApiRequest, callApi } from "./lib/api";
import { useDebouncedEffect } from "@react-hookz/web";
import { defaultExpression, dialects } from "./lib/constants";

export function App() {
  const [req, setReq] = useState<ApiRequest>({
    after: "",
    before: "",
    dialect: "mysql",
    exp: defaultExpression,
    var_name: { db: "db" },
  });
  const [error, setError] = useState("");
  const [sql, setSql] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useDebouncedEffect(
    () => {
      setIsLoading(true);
      callApi(req).then(
        (res) => {
          setError("");
          setSql(res.sql);
          setIsLoading(false);
        },
        (err) => {
          setError(`${err}`);
          setIsLoading(false);
        },
      );
    },
    [req],
    500,
  );

  return (
    <div className="container">
      <div className="header">
        dialect:
        <select
          className="dialect"
          onChange={(e) => {
            setReq((r) => ({
              ...r,
              dialect: e.target.value,
            }));
          }}
        >
          {dialects.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <br />
        variableName:
        <input
          className={"varNameDb"}
          size={5}
          onChange={(e) => {
            setReq((r) => ({
              ...r,
              var_name: { ...r.var_name, db: e.target.value },
            }));
          }}
          value={req.var_name.db}
        />
      </div>
      <div className={"body"}>
        <textarea
          className={"expression"}
          rows={40}
          onChange={(e) => {
            setReq((r) => ({ ...r, exp: e.target.value }));
          }}
          value={req.exp}
        />
        <div className={"sql"}>{sql}</div>
      </div>
      <div className={"error"}>{error}</div>
      <div className={"loading"}>{isLoading && "LOADING..."}</div>
    </div>
  );
}
