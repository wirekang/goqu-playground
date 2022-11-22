package main

import (
	"database/sql"
	"fmt"

	"github.com/doug-martin/goqu/v9"
)

const dialect = "mysql"

func main() {
	db := goqu.New(dialect, &sql.DB{})

	exp := db.Insert("user").Prepared(true).Cols(
		"first_name",
		"last_name",
	).FromQuery(goqu.From("other_table").Select("fn", "ln"))

	sql, _, err := exp.ToSQL()
	if err != nil {
		panic(err)
	}

	fmt.Print(sql)
}
