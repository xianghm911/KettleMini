package com.winning.kettleMini.ioc;

import com.winning.kettleMini.pico.PicoContainerProvider;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public abstract class BaseContext {

    public Map map = new HashMap();

    public Map requestPathMap = new HashMap();

    public PicoContainerProvider picoContainerProvider;

    /**
     * 解析XML
     * @param config_file
     * @throws Exception
     */
    public void XMLParsing(String config_file) throws Exception {
        if(picoContainerProvider == null)
            System.out.println("初始化容器失败！");

        SAXBuilder builder = new SAXBuilder();
        Document doc = builder.build(Thread.currentThread().getContextClassLoader().getResourceAsStream(config_file));
        XPath xpath = XPath.newInstance("//bean");
        List beans = xpath.selectNodes(doc);
        Iterator i = beans.iterator();
        while (i.hasNext()) {
            Element bean = (Element) i.next();
            //String id = bean.getAttributeValue("id");
            String cls = bean.getAttributeValue("class");
            String path = bean.getAttributeValue("path");

            Object obj = Class.forName(cls).newInstance();
            picoContainerProvider.registerComponent(obj.getClass());
            Method[] method = obj.getClass().getDeclaredMethods();
            List<Element> list = bean.getChildren("method");
            List<Element> list2 = bean.getChildren("property");
            for (Element el : list) {
                String methodName = el.getAttributeValue("name");
                String methodPath = el.getAttributeValue("path");
                if(methodName != null && !"".equals(methodName.trim()) && methodPath != null && !"".equals(methodPath.trim())){
                    requestPathMap.put(path+methodPath,methodName);
                    map.put(path+methodPath, cls);
                }
            }
            for (Element el : list2) {
                for (int n = 0; n < method.length; n++) {
                    String name = method[n].getName();
                    String temp = null;
                    if (name.startsWith("set")) {
                        temp = name.substring(3, name.length()).toLowerCase();
                        if (el.getAttribute("name") != null) {
                            if (temp.equals(el.getAttribute("name").getValue())) {
                                method[n].invoke(obj, el.getAttribute("value").getValue());
                            }
                        }
                    }
                }
            }

        }
        //import标签
        XPath xpath_import = XPath.newInstance("//import");
        List imports = xpath_import.selectNodes(doc);
        Iterator iterator = imports.iterator();
        while (iterator.hasNext()) {
            Element bean = (Element) iterator.next();
            String resource = bean.getAttributeValue("resource");
            if(resource != null){
                XMLParsing(resource);
            }
        }

    }

}
