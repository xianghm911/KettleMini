package com.winning.kettleMini.ioc;

import com.winning.kettleMini.pico.PicoContainerProvider;

public class ClassPathXMLApplicationContext  extends BaseContext implements ApplicationContext {

    private String config_file = "config/application.xml";

    public ClassPathXMLApplicationContext( PicoContainerProvider picoContainerProvider) {
        try {
            this.picoContainerProvider = picoContainerProvider;
            XMLParsing(config_file);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Object getBean(Class c) {
        return this.picoContainerProvider.getComponnet(c);
    }

    public Object getBeanByReqPath(String path)  {
        if( map.get(path) == null){
            System.out.println("请求路径名不匹配");
            return null;
        }
        String className = (String) map.get(path);
        Object obj = null;
        try {
            obj = Class.forName(className).newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return this.picoContainerProvider.getComponnet(obj.getClass());
    }

    public String getMethodNameByReqPath(String path) {
        if(requestPathMap.get(path) == null){
            System.out.println("方法路径名不匹配");
            return null;
        }
        return  (String) requestPathMap.get(path);
    }


}
