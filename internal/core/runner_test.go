package core

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

var r *Runner

const insertIn = `db.Insert("user").Prepared(true).Cols(
		"first_name",
		"last_name",
).FromQuery(goqu.From("other_table").Select("fn", "ln"))`
const insertOut = `INSERT INTO "user" ("first_name", "last_name") SELECT "fn", "ln" FROM "other_table"`

const selectIn = `db.From("test").Where(goqu.Ex{
	"d": []string{"a", "b", "c"},
})`
const selectOut = `SELECT * FROM "test" WHERE ("d" IN ('a', 'b', 'c'))`

const updateIn = `db.Update("items").Set(
	goqu.Record{"name": "Test", "address": "111 Test Addr"},
)`
const updateOut = `UPDATE "items" SET "address"='111 Test Addr',"name"='Test'`

const deleteIn = `db.Delete("test").Where(goqu.Ex{
		"c": nil,
	})`
const deleteOut = `DELETE FROM "test" WHERE ("c" IS NULL)`

func testRunner(t *testing.T, dialect string, before, exp, after, output string) {
	if r == nil {
		var err error
		r, err = NewRunner()
		if err != nil {
			panic(err)
		}
	}

	sql, err := r.Run(
		RunOption{
			Dialect: dialect,
			VarName: VarName{
				DB: "db",
			},
			BeforeStatement: before,
			Expression:      exp,
			AfterStatement:  after,
		},
	)
	if err != nil {
		panic(err)
	}

	assert.Equal(t, strings.TrimSpace(sql), strings.TrimSpace(output))
}

func TestRunnerInsertSimple(t *testing.T) {
	testRunner(t, "mysql", "", insertIn, "", insertOut)
}

func TestRunnerSelectSimple(t *testing.T) {
	testRunner(t, "mysql", "", selectIn, "", selectOut)
}

func TestRunnerUpdateSimple(t *testing.T) {
	testRunner(t, "mysql", "", updateIn, "", updateOut)
}

func TestRunnerDeleteSimple(t *testing.T) {
	testRunner(t, "mysql", "", deleteIn, "", deleteOut)
}
