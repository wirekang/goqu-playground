package core

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path"
	"strings"
	"text/template"

	"github.com/samber/lo"
)

var ErrWrongDialect = fmt.Errorf("wrong dialect")
var ErrWrongVarName = fmt.Errorf("wrong variable name")
var ErrWrongExpression = fmt.Errorf("wrong expression")

type TemplateDot struct {
	Dialect         string
	VarName         VarName
	BeforeStatement string
	Expression      string
	AfterStatement  string
}

type VarName struct {
	DB string
}

const templateFileName = "main.go.tmpl"

type Runner struct {
	templateFilePath string
	t                *template.Template
}

type RunOption struct {
	Dialect         string
	VarName         VarName
	BeforeStatement string
	Expression      string
	AfterStatement  string
}

func NewRunner() (*Runner, error) {
	filePath := path.Join(lo.Must(os.Getwd()), "assets", "templates", templateFileName)
	t, err := template.ParseFiles(filePath)
	if err != nil {
		return nil, err
	}

	return &Runner{
		templateFilePath: filePath,
		t:                t,
	}, nil
}

func (r *Runner) Run(opt RunOption) (sql string, err error) {
	if opt.Dialect == "" {
		err = ErrWrongDialect
		return
	}

	if opt.VarName.DB == "" {
		err = ErrWrongVarName
		return
	}

	if opt.Expression == "" {
		err = ErrWrongExpression
		return
	}

	dot := TemplateDot{}
	dot.Dialect = opt.Dialect
	dot.VarName = opt.VarName
	dot.BeforeStatement = opt.BeforeStatement
	dot.Expression = opt.Expression
	dot.AfterStatement = opt.AfterStatement
	buf := &bytes.Buffer{}
	err = r.t.Execute(buf, dot)
	if err != nil {
		return
	}

	err = os.WriteFile("temp.go", buf.Bytes(), 0755)
	if err != nil {
		return
	}

	cmd := exec.Command("go", "run", "temp.go")
	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	cmd.Stdout = stdout
	cmd.Stderr = stderr
	err = cmd.Run()
	if err != nil {
		stdErrBytes, _ := io.ReadAll(stderr)
		_, e, _ := strings.Cut(string(stdErrBytes), ":")
		err = fmt.Errorf("%s", e)
		return
	}

	b, err := io.ReadAll(stdout)
	if err != nil {
		return
	}

	sql = string(b)
	return
}
