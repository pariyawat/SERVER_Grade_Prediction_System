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
  rs <- dbGetQuery(mydb, "set character set utf8")
  
  
  stu_grade <-
    c("SELECT subject_cpe,grade FROM grade_history where student_ID ='",
      STD_ID,
      "'")
  rs = dbSendQuery(mydb, paste(stu_grade, collapse = ""))
  data.student = fetch(rs, n = -1)
  
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
  rs = dbSendQuery(mydb, paste(stu_learns, collapse = ""))
  data.train = fetch(rs, n = -1)
  data.train <-
    data.train[colSums(is.na(data.train)) < nrow(data.train) * 0.9]
  
  stu_grade.mean <-
    c("SELECT credit FROM subject where subject_cpe = '",
      SUB_CPE,
      "'")
  rs = dbSendQuery(mydb, paste(stu_grade.mean, collapse = ""))
  means = fetch(rs, n = -1)
  
  stu_name <-
    c(
      "SELECT CONCAT(first_name,'  ',last_name) as name FROM student where student_id = '",
      STD_ID,
      "'"
    )
  rs = dbSendQuery(mydb, paste(stu_name, collapse = ""))
  name = fetch(rs, n = -1)
  
  Config <-
    c("SELECT support,confidence FROM asso_config")
  rs = dbSendQuery(mydb, paste(Config, collapse = ""))
  assoConfig = fetch(rs, n = -1)
  configs <- assoConfig / 100
  
  dbDisconnect(mydb)
  
  if (nrow(data.train) < 100) {
    ret <-
      list(
        STD_ID = STD_ID,
        SUB_CPE = SUB_CPE,
        STD_NAME = name$name,
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
        supp = configs[[1]],
        conf = configs[[2]],
        target = "rules"
      ),
      appearance = list(rhs = subject.foctor, default = "lhs")
    )
    
    rules <- sort(rules.all, by = "confidence")
    
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
        STD_NAME = name$name,
        SUB_CPE = SUB_CPE,
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





results <- list()

for (x in 1:length(jsons)) {
  results[x] <-
    list(Pidiction(jsons[[x]]$STD_ID, jsons[[x]]$SUB_CPE, jsons[[x]]$SUB_NAME))
}

mean.g <- c()
creditx <- c()
meanx <- c()

for (i in 6:7) {
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
      mean.g[m] <- 4 * results[[m]]$CREDIT
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

result <- list(results = results,
               gpaDT = meanx[1],
               gpaASSO = meanx[2])





output <- list(result = result)

# output JSON
print(toJSON(output))