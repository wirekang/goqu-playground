package core

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/valyala/fastjson"
)

var runner *Runner

func Listen() error {
	var err error
	runner, err = NewRunner()
	if err != nil {
		return err
	}

	e := gin.Default()
	e.Use(
		cors.New(
			cors.Config{
				AllowAllOrigins: true,
				AllowHeaders:    []string{"*"},
				AllowMethods:    []string{"GET", "POST"},
			},
		),
	)
	e.POST("/", handlePost)
	return e.Run(":8080")
}

func handlePost(c *gin.Context) {
	var err error
	defer func() {
		if err != nil {
			c.AbortWithStatusJSON(
				500, map[string]any{
					"error": err.Error(),
				},
			)
		}
	}()
	body, err := c.GetRawData()
	if err != nil {
		return
	}

	v, err := fastjson.ParseBytes(body)
	if err != nil {
		return
	}

	dialect := v.GetStringBytes("dialect")
	varName := v.Get("var_name")
	db := varName.GetStringBytes("db")
	before := v.GetStringBytes("before")
	exp := v.GetStringBytes("exp")
	after := v.GetStringBytes("after")

	sql, err := runner.Run(
		RunOption{
			Dialect: string(dialect),
			VarName: VarName{
				DB: string(db),
			},
			BeforeStatement: string(before),
			Expression:      string(exp),
			AfterStatement:  string(after),
		},
	)
	if err != nil {
		return
	}

	c.JSON(
		http.StatusOK, map[string]any{
			"sql": sql,
		},
	)
}
