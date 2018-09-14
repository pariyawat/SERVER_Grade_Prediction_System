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
  
  # ดึงข้อมูลจากฐานข้อมูล #####################################################
  
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
  
  stu_learns <-
    c(paste(
      "SELECT",
      Query.suject,
      "FROM learning WHERE",
      SUB_CPE ,
      "IS NOT NULL"
    ))
  #stu_learns <- c(paste("SELECT * FROM learning2"))
  gs = dbSendQuery(mydb, paste(stu_learns, collapse = ""))
  data.train = fetch(gs, n = -1)
  
  dbDisconnect(mydb)
  
  if (nrow(data.train) < 100) { #ตรวจสอบค่า
    
    ret <-
      list(
        STD_ID = STD_ID,
        SUB_NAME = SUB_NAME,
        DT  = list(Grade = "?", Accuracy = "?"),
        ASSO = list(Grade = "?", Confidence = "?")
      )
    
  } else {
    # ทดสอบโมเดลต้นไม้ ########################################################
    formula.tree <-
      as.formula(paste(SUB_CPE, "~", paste(
        setdiff(data.student$subject_cpe, SUB_CPE), collapse = "+"
      )))
    
    set.seed(123)
    folds <- split(data.train, cut(sample(1:nrow(data.train)), 10))
    acc <- rep(NA, length(folds))
    Grade.add <- c("A", "B+", "B", "C+", "C", "D+", "D", "F", "S","U")
    
    for (u in 1:length(folds)) {
      test <- ldply(folds[u], data.frame)
      train <- ldply(folds[-u], data.frame)
      
      for (P in 1:10) {
        train[nrow(train) + 1, ] = list(Grade.add[P])
      }
      
      tmp.model <- rpart(formula.tree , train, method = "class")
      tmp.predict <- predict(tmp.model, newdata = test, type = "class")
      
      conf.mat <- table(test[[SUB_CPE]], tmp.predict)
      
      dig <- c()
        for(counts in 1:length(row.names(conf.mat))) {
          dig[counts] <- conf.mat[row.names(conf.mat)[counts],row.names(conf.mat)[counts]]
        }
      
      
      acc[u] <- 100*sum(dig) / sum(conf.mat)
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
    
    # สร้างโมเดลต้นไม้ & ทำนายผลด้วยโมเดลต้นไม้ ##############################
    
    student.dtModel <-
      rpart(formula.tree, data.train.DT, method = "class")
    
    student.pred.DT <-
      predict(student.dtModel, data.test, type = "class")
    
    # สร้างกฏความสัมพันธ์ & ทำนายผลด้วยกฏ ########################################
    
    
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
    
    if(length(rules.all) == 0){
      rules <- rules.all 
    } else {
    
    rules.all <- sort(rules.all, by = "confidence")
    subsetRules <- which(colSums(is.subset(rules.all, rules.all)) > 1)
    #length(subsetRules)  #> 3913
    rules <- rules.all[-subsetRules] # remove subset rules.
    
    }
    ###############################################################################
    
    rulesMatch <- is.subset(rules@lhs, data.test)
    suitableRules <- rulesMatch & !(is.subset(rules@rhs, data.test))
    as.logical(suitableRules)
    
    result <- data.frame(inspect(rules[as.logical(suitableRules)]))
    
    if (nrow(result) == 0) {
      result.grade <- ("No rules")
      result.confiden <- ("No rules")
    } else {
      result.grades <-
        c(substr(result$rhs[1], 9, 9), substr(result$rhs[1], 10, 10))
      
      if ("}" %in% result.grades) {
        result.grade <- result.grades[1]
      } else {
        result.grade <- paste0(result.grades[1], result.grades[2])
      }
      result.confiden <- round(result$confidence[1], 2)*100
    }
    ##############################################################################3
    ret <-
      list(
        STD_ID = STD_ID,
        SUB_NAME = SUB_NAME,
        DT  = list(Grade = student.pred.DT[[1]], Accuracy = round(max(acc), 2)),
        ASSO = list(Grade = result.grade, Confidence = result.confiden)
      )
    
    
  }
}

results <- list()

for (x in 1:length(jsons)) {
  results[x] <- list(Pidiction(jsons[[x]]$STD_ID, jsons[[x]]$SUB_CPE, jsons[[x]]$SUB_NAME))
}

#convert return of function to list
output <- list(result = results, GPA = '2.25')

# output JSON
print(toJSON(output));