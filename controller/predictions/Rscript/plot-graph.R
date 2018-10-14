#json library
library(rjson)

# get arguments of cli
args <- commandArgs(trailingOnly = TRUE)

# arguments to JSON
json <- fromJSON(args)

data <- json[[1]]

Sub.cpe <- list()

for (n in 1:length(data[[1]]$results)) {
  gradeSUM <- list()
  s <- 1
  
  for (b in 6:7) {
    count.grade <- c(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    for (v in 1:length(data)) {
      if (data[[v]]$results[[c(n, b)]]$Grade == "F") {
        count.grade[1] <- count.grade[1] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "D") {
        count.grade[2] <- count.grade[2] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "D+") {
        count.grade[3] <- count.grade[3] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "C") {
        count.grade[4] <- count.grade[4] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "C+") {
        count.grade[5] <- count.grade[5] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "B") {
        count.grade[6] <- count.grade[6] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "B+") {
        count.grade[7] <- count.grade[7] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "A") {
        count.grade[8] <- count.grade[8] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "U") {
        count.grade[10] <- count.grade[10] + 1
      } else if (data[[v]]$results[[c(n, b)]]$Grade == "S") {
        count.grade[11] <- count.grade[11] + 1
      } else {
        count.grade[9] <- count.grade[9] + 1
      }
    }
    gradeSUM[s] <- list(count.grade)
    s = s + 1
  }
  Sub.cpes <-
    list(
      SUB_NAME = data[[1]]$results[[c(n,4)]],
      graphDT = gradeSUM[[1]],
      graphASSO = gradeSUM[[2]]
    )
  Sub.cpe[n] <- list(Sub.cpes)
}

output <- list(result = Sub.cpe)

# output JSON
print(toJSON(output))
