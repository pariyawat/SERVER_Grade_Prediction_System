# json library
library('rjson')
 
# get arguments of cli
args <- commandArgs(trailingOnly = TRUE)
 
# arguments to JSON
json <- fromJSON(args)
 
# call function
dataToJson <- json[[1]]

Pidiction = function(ID,SUB_CPE,SUB_NAME){
  library(DBI)
  library(RMySQL) 
  library(rpart)
  library(Matrix)
  library(arules)
  library(rjson)
  
  # ดึงข้อมูลจากฐานข้อมูล ###########################################################
  
  mydb = dbConnect(MySQL(), user='root', password='', dbname='gpadb', host='localhost')
  dbListTables(mydb)
  hs <- dbGetQuery(mydb, "set character set utf8")
  gs <- dbGetQuery(mydb, "set character set utf8")
  
  stu_grade <- c("SELECT subject_cpe,grade FROM grade_history where student_ID ='", ID, "'")
  hs = dbSendQuery(mydb, paste(stu_grade, collapse=""))
  data.student = fetch(hs, n=-1)
  
  Query.suject <- paste(c(paste(data.student$subject_cpe),paste(SUB_CPE)),collapse = ",")
  
  stu_learns <- c(paste("SELECT",Query.suject,"FROM learning WHERE", SUB_CPE ,"IS NOT NULL"))
  gs = dbSendQuery(mydb, paste(stu_learns, collapse=""))
  data.train = fetch(gs, n=-1)

  
  # สร้างโมเดลต้นไม้ & ทำนายผลด้วยโมเดลต้นไม้ ##########################################
  
  
  data.test <- data.frame(matrix(c(data.student$grade), nrow = 1, byrow = TRUE,
                       dimnames = list(c("1"), 
                                       data.student$subject_cpe)))
  
  formula.tree <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.dtModel <- rpart(formula.tree,data = data.train)
  student.pred <- predict(student.dtModel, data.test, type = "class")
  
  # สร้างกฏความสัมพันธ์ & ทำนายผลด้วยกฏ ###############################################
  
  # transaction_data = data.frame(sapply(data.train,as.factor))
  # t2 <- as(transaction_data,"transactions")
  # subject.foctor <- c(paste0(SUB_CPE,"=F"),
  #                     paste0(SUB_CPE,"=D"),
  #                     paste0(SUB_CPE,"=D+"),
  #                     paste0(SUB_CPE,"=C"),
  #                     paste0(SUB_CPE,"=C+"),
  #                     paste0(SUB_CPE,"=B"),
  #                     paste0(SUB_CPE,"=B+"),
  #                     paste0(SUB_CPE,"=A"))
  
  # rules.all <- apriori(t2,
  #                      control = list(verbose=F),
  #                      parameter = list(minlen=2, supp=0.003, conf=0.5,target = "rules"),
  #                      appearance = list(rhs=subject.foctor,default="lhs"))
  # inspect(rules.all)
  # V <- c(paste0(data.student$subject,"=",data.student$grade))
  
  # rules.all <- sort(rules.all, by="lift")
  # subsetRules <- which(colSums(is.subset(rules.all, rules.all)) > 1) 
  # length(subsetRules)  #> 3913
  # rules <- rules.all[-subsetRules] # remove subset rules.
  # B <- inspect(rules)
  
  
  # ทดสอบโมเดลต้นไม้ ############################################################
  
  flags = sample(1:10, nrow(data.train), replace = T, prob = c(0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1))
  data1 = data.train[flags==1,]
  data2 = data.train[flags==2,]
  data3 = data.train[flags==3,]
  data4 = data.train[flags==4,]
  data5 = data.train[flags==5,]
  data6 = data.train[flags==6,]
  data7 = data.train[flags==7,]
  data8 = data.train[flags==8,]
  data9 = data.train[flags==9,]
  data10 = data.train[flags==10,]
  
  acc <- c()
  #Loop1
  student.train<- rbind(data3,data4, data5, data6,data7, data8, data9,data10)
  student.test<- rbind(data1, data2)
  Y <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.model <- rpart(Y,data = student.train)
  student.preds = predict(student.model, student.test, type = "class")
  acc <- append(acc, sum(student.test[[SUB_CPE]]==student.preds)/nrow(student.test))
  #Loop2
  student.train<- rbind(data1,data2, data5, data6,data7, data8, data9,data10)
  student.test<- rbind(data3, data4)
  Y <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.model <- rpart(Y,data = student.train)
  student.preds = predict(student.model, student.test, type = "class")
  acc <- append(acc, sum(student.test[[SUB_CPE]]==student.preds)/nrow(student.test))
  #Loop3
  student.train<- rbind(data1,data2, data3, data4 ,data7, data8, data9,data10)
  student.test<- rbind(data5, data6)
  Y <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.model <- rpart(Y,data = student.train)
  student.preds = predict(student.model, student.test, type = "class")
  acc <- append(acc, sum(student.test[[SUB_CPE]]==student.preds)/nrow(student.test))
  #Loop4
  student.train<- rbind(data1,data2, data3, data4 ,data5, data6, data9,data10)
  student.test<- rbind(data7, data8)
  Y <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.model <- rpart(Y,data = student.train)
  student.preds = predict(student.model, student.test, type = "class")
  acc <- append(acc, sum(student.test[[SUB_CPE]]==student.preds)/nrow(student.test))
  #Loop5
  student.train<- rbind(data1,data2, data3, data4,data5, data6, data7 ,data8)
  student.test<- rbind(data9, data10)
  Y <- as.formula(paste(SUB_CPE,"~", paste(data.student$subject_cpe, collapse="+")))
  student.model <- rpart(Y,data = student.train)
  student.preds = predict(student.model, student.test, type = "class")
  acc <- append(acc, sum(student.test[[SUB_CPE]]==student.preds)/nrow(student.test))
  
  acc_value <- format(round(sum(acc)/5*100, 2), nsmall = 2)
  

 ret <- list(STD_ID = ID, SUB_NAME = SUB_NAME, DT  = list(Grade = student.pred[[1]], Accuracy = acc_value),ASSO = list(Grade = student.pred[[1]], Confidence = "50", Lift = '1'))
  return (ret)
  #######################################################################
  
  }

# ret <- list(status = "SUCCESS", code = "200",output = list(studentid = "1001", name = "Kevin"))
#   output<-toJSON(x,pretty = TRUE, auto_unbox = TRUE)
#   return (output)


ret <- Pidiction(dataToJson[[1]]$STD_ID,dataToJson[[1]]$SUB_CPE,dataToJson[[1]]$SUB_NAME)
 
# convert return of function to list
 output <- list(result = ret)
 
# output JSON
print(toJSON(output));