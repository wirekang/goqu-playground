package core

import (
	"fmt"
	"net/http"
	"os"

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

	gin.SetMode(os.Getenv("GIN_MODE"))
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
	e.GET("/", handleGet)
	e.POST("/", handlePost)
	return e.Run(fmt.Sprintf("0.0.0.0:%s", os.Getenv("PORT")))
}

func handleGet(c *gin.Context) {
	c.JSON(200, map[string]any{"status": "ok"})
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
