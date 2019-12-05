package com.winning.kettleMini.ioc;

public interface ApplicationContext  {


     /**
      * 根据名称获取bean
      * @param c
      * @return
      */
     Object getBean(Class c);


     /**
      * 根据请求路径获取bean
      * @param path
      * @return
      */
     Object getBeanByReqPath(String path) ;


     String getMethodNameByReqPath(String path);

}
