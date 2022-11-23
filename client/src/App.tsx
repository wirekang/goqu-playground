import "./App.css";
import { useEffect, useState } from "react";
import { ApiRequest, callApi } from "./lib/api";
import { useDebouncedEffect } from "@react-hookz/web";
import {
  dialects,
  examples,
  golangVersion,
  goquVersion,
} from "./lib/constants";
import { formatSql } from "./lib/format";
import "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-go";
import "prismjs/themes/prism.css";
import { highlight, languages } from "prismjs";

export function App() {
  const [req, setReq] = useState<ApiRequest>(() => {
    try {
      const params = new URLSearchParams(location.search);
      const arg = params.get("arg");
      if (arg == null) {
        return examples["SELECT"];
      }
      return JSON.parse(atob(arg));
    } catch (e) {
      console.log(e);
      return examples["SELECT"];
    }
  });
  const [error, setError] = useState("");
  const [sql, setSql] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("arg", btoa(JSON.stringify(req)));
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [req]);

  useDebouncedEffect(
    () => {
      if (req.exp === "") {
        return;
      }

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
            <div className="varNameLabelLeft">var</div>
            <div style={{ display: "inline-block", minWidth: "100px" }}>
              dialect
            </div>
            <span>= </span>
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
              size={6}
              onChange={(e) => {
                setReq((r) => ({
                  ...r,
                  var_name: { ...r.var_name, db: e.target.value },
                }));
              }}
              value={req.var_name.db}
              placeholder="var name"
            />
            *goqu.Database
          </div>
          <Editor
            className="code beforeStmt"
            value={req.before}
            onValueChange={(before) => {
              setReq((r) => ({ ...r, before }));
            }}
            highlight={(code) => highlight(code, languages.go, "go")}
            placeholder="Statement before expression"
            padding={4}
            tabSize={4}
          />
          <Editor
            className="code expression"
            value={req.exp}
            onValueChange={(exp) => {
              setReq((r) => ({ ...r, exp }));
            }}
            highlight={(code) => highlight(code, languages.go, "go")}
            placeholder="Expression for *goqu.(Insert/Select/Update/Delete)Dataset"
            padding={4}
            tabSize={4}
          />
        </div>
        <div className="right">
          <div className={"error"}>{error}</div>
          <Editor
            className="sql"
            value={formatSql(sql, req.dialect)}
            onValueChange={() => {}}
            readOnly
            highlight={(code) => highlight(code, languages.sql, "sql")}
            padding={8}
            placeholder="Result"
          />
        </div>
      </div>
      <div className="footer">
        <div className="loading">{isLoading && "LOADING..."}</div>
        <div className="version">
          <div>
            <span className="versionName">go</span>
            <span>{golangVersion}</span>
          </div>
          <div>
            <span className="versionName">goqu</span>
            <span>{goquVersion}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
