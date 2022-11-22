import "./App.css";
import { useState } from "react";
import { ApiRequest, callApi } from "./lib/api";
import { useDebouncedEffect } from "@react-hookz/web";
import { dialects, examples } from "./lib/constants";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism";
import { formatSql } from "./lib/format";

export function App() {
  const [req, setReq] = useState<ApiRequest>(examples["simple-insert"]);
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
    300,
  );

  return (
    <div className="container">
      <div className="header">
        <div>
          Example:
          <select
            onChange={(e) => {
              const key = e.target.value;
              setReq({ ...examples[key] });
            }}
          >
            {Object.keys(examples).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <a target="_blank" href="https://github.com/wirekang/goqu-playground">
            Github
          </a>
        </div>
      </div>
      <div className="body">
        <div className="left">
          <div className="leftHeader">
            <span>const dialect = </span>
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
            <div className="varNameLabelLeft">var</div>
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
            *goqu.Database
          </div>
          <textarea
            className={"code beforeStmt"}
            placeholder="Statement before expression"
            rows={15}
            onChange={(e) => {
              setReq((r) => ({ ...r, before: e.target.value }));
            }}
            value={req.before}
          />
          <textarea
            className={"code expression"}
            placeholder="Expression for *goqu.*Dataset"
            rows={20}
            onChange={(e) => {
              setReq((r) => ({ ...r, exp: e.target.value }));
            }}
            value={req.exp}
          />
        </div>
        <div className="right">
          <div className={"error"}>{error}</div>
          <div className={"sql"}>
            <SyntaxHighlighter customStyle={{ width: "90%" }} language="sql">
              {formatSql(sql, req.dialect)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      <div className={"loading"}>{isLoading && "LOADING..."}</div>
    </div>
  );
}
