# needs(RMySQL,rpart)
#     attach(input[[1]])
#     mydb = dbConnect(MySQL(), user='root', password='', dbname='gpadb', host='localhost')
#     dbListTables(mydb)
#     rs <- dbGetQuery(mydb, "set character set utf8")
#     hs <- dbGetQuery(mydb, "set character set utf8")
    
#     stu_learn <- c("SELECT * FROM learning")
#     rs = dbSendQuery(mydb, paste(stu_learn, collapse=""))
#     data1 = fetch(rs, n=-1)
#     print("ok")
#     stu_grade <- c("SELECT subject_cpe,grade FROM grade_history where student_id ='", id, "'")
#     hs = dbSendQuery(mydb, paste(stu_grade, collapse=""))
#     data2 = fetch(hs, n=-1)
    
    
#     data.tests <- matrix(c(data2$grade), nrow = 1, byrow = TRUE,
#                        dimnames = list(c("1"), 
#                                        data2$subject_cpe))

#    data.test<-data.frame(data.tests)
    
#     Y <- as.formula(paste(subject,"~", paste(data2$subject_cpe, collapse="+")))
#     student.dtModel <- rpart(Y,data = data1)
    
#     student.pred <- predict(student.dtModel, data.test, type = "class")
#     return(student.pred)

print("Hello")