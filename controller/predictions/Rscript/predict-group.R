#json library
library(rjson)

# get arguments of cli
args <- commandArgs(trailingOnly = TRUE)

# arguments to JSON
json <- fromJSON(args)

jsons <- json[[1]]

# call function
Pidiction = function(STD_ID, SUB_CPE, SUB_NAME) {
  library(DBI)
  library(RMySQL)
  library(rpart)
  library(Matrix)
  library(rjson)
  library(arules)
  library(plyr)
  library(dplyr)
  
  mydb = dbConnect(
    MySQL(),
    user = 'root',
    password = '',
    dbname = 'gpadb',
    host = 'localhost'
  )
  dbListTables(mydb)
  hs <- dbGetQuery(mydb, "set character set utf8")
  gs <- dbGetQuery(mydb, "set character set utf8")
  ms <- dbGetQuery(mydb, "set character set utf8")
  
  stu_grade <-
    c("SELECT subject_cpe,grade FROM grade_history where student_ID ='",
      STD_ID,
      "'")
  hs = dbSendQuery(mydb, paste(stu_grade, collapse = ""))
  data.student = fetch(hs, n = -1)
  
  Query.suject <-
    paste(c(paste(unique(paste(
      c(paste(data.student$subject_cpe), paste(SUB_CPE))
    )))), collapse = ",")
  Query.suject
  stu_learns <-
    c(paste(
      "SELECT",
      Query.suject,
      "FROM learning WHERE",
      SUB_CPE ,
      "IS NOT NULL"
    ))
  gs = dbSendQuery(mydb, paste(stu_learns, collapse = ""))
  data.train = fetch(gs, n = -1)
  data.train <-
    data.train[colSums(is.na(data.train)) < nrow(data.train) * 0.9]
  
  stu_grade.mean <-
    c("SELECT credit FROM subject where subject_cpe = '",
      SUB_CPE,
      "'")
  hs = dbSendQuery(mydb, paste(stu_grade.mean, collapse = ""))
  means = fetch(hs, n = -1)
  
  dbDisconnect(mydb)
  
  if (nrow(data.train) < 100) {

    ret <-
      list(
        STD_ID = STD_ID,
        SUB_NAME = SUB_NAME,
        CREDIT = means$credit,
        DT  = list(Grade = '?', Accuracy = 0),
        ASSO = list(Grade = '?', Confidence = 0)
      )
    
  } else {
    formula.tree <-
      as.formula(paste(SUB_CPE, "~", paste(
        setdiff(colnames(data.train), SUB_CPE), collapse = "+"
      )))
    
    set.seed(123)
    folds <- split(data.train, cut(sample(1:nrow(data.train)), 10))
    acc <- rep(NA, length(folds))
    Grade.add <-
      c("A", "B+", "B", "C+", "C", "D+", "D", "F", "S", "U")
    
    for (u in 1:length(folds)) {
      test <- ldply(folds[u], data.frame)
      train <- ldply(folds[-u], data.frame)
      
      for (P in 1:10) {
        train[nrow(train) + 1, ] = list(Grade.add[P])
      }
      
      tmp.model <- rpart(formula.tree , train, method = "class")
      tmp.predict <-
        predict(tmp.model, newdata = test, type = "class")
      
      conf.mat <- table(test[[SUB_CPE]], tmp.predict)
      
      dig <- c()
      for (counts in 1:length(row.names(conf.mat))) {
        dig[counts] <-
          conf.mat[row.names(conf.mat)[counts], row.names(conf.mat)[counts]]
      }
      
      
      acc[u] <- 100 * sum(dig) / sum(conf.mat)
    }
    
    select.model <- which(acc == max(acc))
    data.train.DT <- ldply(folds[-select.model[1]], data.frame)
    for (e in 1:10) {
      data.train.DT[nrow(data.train.DT) + 1, ] = list(Grade.add[e])
    }
    data.test <-
      data.frame(matrix(
        c(data.student$grade),
        nrow = 1,
        byrow = TRUE,
        dimnames = list(c("1"),
                        data.student$subject_cpe)
      ))
    

    student.dtModel <-
      rpart(formula.tree, data.train.DT, method = "class")
    
    student.pred.DT <-
      predict(student.dtModel, data.test, type = "class")

    
    dis <- distinct(select(data.train, SUB_CPE))
    subject.foctor <- c()
    for (i in 1:nrow(dis)) {
      subject.foctor[i] <- paste0(SUB_CPE, '=', dis[i, 1])
    }
    transaction_data = data.frame(sapply(data.train, as.factor))
    trans.train = as(transaction_data, "transactions")
    data.test = as(data.test, "transactions")
    
    rules.all <- apriori(
      trans.train,
      control = list(verbose = F),
      parameter = list(
        minlen = 2,
        supp = 0.01,
        conf = 0.5 ,
        target = "rules"
      ),
      appearance = list(rhs = subject.foctor, default = "lhs")
    )
    if (length(rules.all) == 0) {
      rules <- rules.all
    } else {
      rules.all <- sort(rules.all, by = "confidence")
      subsetRules <-
        which(colSums(is.subset(rules.all, rules.all)) > 1)
      rules <- rules.all[-subsetRules] # remove subset rules.
      length(rules.all)
    }
    ###############################################################################
    
    rulesMatch <- is.subset(rules@lhs, data.test)
    suitableRules <- rulesMatch & !(is.subset(rules@rhs, data.test))
    
    result <- data.frame(inspect(rules[as.logical(suitableRules)]))
    
    if (nrow(result) == 0) {
      result.grade <- "?"
      result.confiden <- 0
    } else {
      result.grades <-
        c(substr(result$rhs[1], 9, 9), substr(result$rhs[1], 10, 10))
      
      if ("}" %in% result.grades) {
        result.grade <- result.grades[1]
      } else {
        result.grade <- paste0(result.grades[1], result.grades[2])
      }
      result.confiden <- round(result$confidence[1], 2) * 100
    }
    ##############################################################################3
    ret <-
      list(
        STD_ID = STD_ID,
        SUB_NAME = SUB_NAME,
        CREDIT = means$credit,
        DT  = list(
          Grade = as.character(student.pred.DT[[1]]),
          Accuracy = round(max(acc), 2)
        ),
        ASSO = list(Grade = result.grade, Confidence = result.confiden)
      )
  }
}



Pidictiongroup = function(jsons) {
  

count.subject <- c()
count.subject.cpe <- c()
for (i.c in 1:length(jsons)) {
  count.subject[i.c] <- jsons[[i.c]]$STD_ID
  count.subject.cpe[i.c] <- jsons[[i.c]]$SUB_NAME
}
count.subject.cpe <- unique(count.subject.cpe)
cnt.s <- as.numeric(table(count.subject)[1])
cnts.s <- cnt.s
cnt <- 1
c <- 1
resultqr = list()

while (cnt.s < length(jsons) + 1) {
  print(paste(cnt, cnt.s))
  
  json.s <- jsons[cnt:cnt.s]
  
  results <- list()
  
  for (x in 1:length(json.s)) {
    results[x] <-
      list(Pidiction(json.s[[x]]$STD_ID, json.s[[x]]$SUB_CPE, json.s[[x]]$SUB_NAME))
  }
  
  mean.g <- c()
  creditx <- c()
  meanx <- c()
  
  for (i in 4:5) {
    for (m in 1:length(results)) {
      if (results[[c(m, i)]]$Grade == "D") {
        mean.g[m] <- 1 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "D+") {
        mean.g[m] <- 1.5 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "C") {
        mean.g[m] <- 2 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "C+") {
        mean.g[m] <- 2.5 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "B") {
        mean.g[m] <- 3 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "B+") {
        mean.g[m] <- 3.5 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "A") {
        mean.g[m] <- 4 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "S") {
        mean.g[m] <- 1 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      } else if (results[[c(m, i)]]$Grade == "?") {
        mean.g[m] <- 0 * results[[m]]$CREDIT
        creditx[m] <-  0
      } else {
        mean.g[m] <- 0 * results[[m]]$CREDIT
        creditx[m] <-  results[[m]]$CREDIT
      }
    }
    if (sum(mean.g) == 0) {
      meanx <- append(meanx, 0)
    } else {
      meanx <- append(meanx, round(sum(mean.g) / sum(creditx), 2))
    }
  }
  
  #convert return of function to list
  #rusu <- list(result = results, gpaDT = meanx[1], gpaASSO = meanx[2])
  
  resultq <- list(results = results,
                  gpaDT = meanx[1],
                  gpaASSO = meanx[2])
  resultqr[c] <- list(resultq)
  cnt = cnt + cnts.s
  cnt.s = cnt.s + cnts.s
  meanx <- c()
  mean.g <- c()
  creditx <- c()
  c = c + c
}

Sub.cpe <- list()

for (n in 1:length(results)) {
  gradeSUM <- list()
  s <- 1
  
  for (b in 4:5) {
    count.grade <- c(0, 0, 0, 0, 0, 0, 0, 0, 0)
    for (v in 1:length(resultqr)) {
      if (resultqr[[v]]$results[[c(n, b)]]$Grade == "F") {
        count.grade[1] <- count.grade[1] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "D") {
        count.grade[2] <- count.grade[2] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "D+") {
        count.grade[3] <- count.grade[3] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "C") {
        count.grade[4] <- count.grade[4] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "C+") {
        count.grade[5] <- count.grade[5] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "B") {
        count.grade[6] <- count.grade[6] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "B+") {
        count.grade[7] <- count.grade[7] + 1
      } else if (resultqr[[v]]$results[[c(n, b)]]$Grade == "A") {
        count.grade[8] <- count.grade[8] + 1
      } else {
        count.grade[8] <- count.grade[9] + 1
      }
    }
    gradeSUM[s] <- list(count.grade)
    s = s + 1
  }
  Sub.cpes <-
    list(
      SUB_NAME = count.subject.cpe[n],
      graphDT = gradeSUM[[1]],
      graphASSO = gradeSUM[[2]]
    )
  Sub.cpe[n] <- list(Sub.cpes)
}

data <-
  list(data = resultqr, graph = Sub.cpe)
return(data)
}

result <- list(Pidictiongroup(jsons))

output <- list(result = result)

# output JSON
print(toJSON(output))
