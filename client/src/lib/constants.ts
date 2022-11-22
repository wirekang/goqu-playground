export const dialects = ["mysql", "postgres", "sqlite3", "sqlserver"] as const;
export const defaultExpression = `db.From("user").
Insert().
Cols("first_name","last_name").
Vals(
  goqu.Vals{"Greg", "Farley"},
  goqu.Vals{"Jimmy", "Stewart"},
  goqu.Vals{"Jeff", "Jeffers"},
)
`;
