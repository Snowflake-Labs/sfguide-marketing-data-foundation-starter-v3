import subprocess
from subprocess import Popen, PIPE
import os

def executeStatement(statement, format = ""):
    resultConn = subprocess.check_output(f" snow sql -q \"{ statement}\" {format} ", shell=True)
    print(resultConn.decode("utf-8"))
    return resultConn.decode("utf-8")

def executeCopyToStage(directory, stage):
    resultConn = subprocess.check_output( f"snow stage copy {directory} {stage} --parallel 2", shell=True)
    print(resultConn.decode("utf-8"))
    return resultConn.decode("utf-8")
    