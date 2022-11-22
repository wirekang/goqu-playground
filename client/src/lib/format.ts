import { format } from "sql-formatter";
import { formatDialectMap } from "./constants";

export function formatSql(sql: string, dialect: string) {
  try {
    let lang = formatDialectMap[dialect];
    if (!lang) {
      lang = "sql";
    }
    return format(sql, { language: lang });
  } catch (e) {
    console.log(e);
    return "";
  }
}
