import { ApiRequest } from "./api";

export const dialects = ["mysql", "postgres", "sqlite3", "sqlserver"] as const;

export const formatDialectMap: Record<string, string> = {
  postgres: "postgresql",
  mysql: "mysql",
  sqlite3: "sqlite",
  sqlserver: "sql",
};

export const syntaxDialectMap: Record<string, string> = {
  postgres: "pgsql",
  mysql: "sql",
  sqlite3: "sql",
  sqlserver: "sql",
};

export const examples: Record<string, ApiRequest> = {
  SELECT: {
    dialect: "mysql",
    before: "",
    after: "",
    exp: "",
    var_name: { db: "" },
  },
  "simple-insert": {
    dialect: "mysql",
    before: "",
    after: "",
    var_name: { db: "db" },
    exp: `db.From("user").
Insert().
Cols("first_name","last_name").
Vals(
  goqu.Vals{"Greg", "Farley"},
  goqu.Vals{"Jimmy", "Stewart"},
  goqu.Vals{"Jeff", "Jeffers"},
)
`,
  },
  "simple-select-struct": {
    dialect: "mysql",
    before: `type myStruct struct {
    Name         string
    Address      string \`db:"address"\`
    EmailAddress string \`db:"eamil_address"\`
}`,
    after: "",
    exp: `db.From("table").Select(&myStruct{})`,
    var_name: { db: "db" },
  },
  "postgres-lateral": {
    dialect: "postgres",
    before: `maxEntry := db.From("entry").
    Select(goqu.MAX("int").As("max_int")).
    Where(goqu.Ex{"time": goqu.Op{"lt": goqu.I("e.time")}}).
    As("max_entry")

maxId := db.From("entry").
    Select("id").
    Where(goqu.Ex{"int": goqu.I("max_entry.max_int")}).
    As("max_id")`,
    after: "",
    exp: `db.Select("e.id", "max_entry.max_int", "max_id.id").
    From(
        goqu.T("entry").As("e"),
        goqu.Lateral(maxEntry),
        goqu.Lateral(maxId),
    )`,
    var_name: { db: "db" },
  },
  timezone: {
    dialect: "mysql",
    before: `loc, err := time.LoadLocation("Asia/Seoul")
if err != nil {
    panic(err)
}

goqu.SetTimeLocation(loc)

created, err := time.Parse(time.RFC3339, "2019-10-01T15:01:00Z")
if err != nil {
    panic(err)
}
    `,
    after: "",
    exp: `db.Insert("test").Rows(goqu.Record{
    "address": "111 Address",
    "name":    "Bob Yukon",
    "created": created,
})`,
    var_name: { db: "db" },
  },
} as const;

export const goquVersion = "9.18.0";
export const golangVersion = "1.19";
