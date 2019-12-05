package com.winning.kettleMini.httpService;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.winning.kettleMini.ModelResult.CustomResult;
import com.winning.kettleMini.http.KettleMiniServlet;
import com.winning.kettleMini.ioc.ApplicationContext;
import com.winning.kettleMini.json.JSONUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedHashMap;
import java.util.Map;

public class KtRequestService {

    private static final KtRequestService instance = new KtRequestService();

    public static KtRequestService getInstance()
    {
        return instance;
    }

    public void service(String url, HttpServletRequest request, HttpServletResponse response)
    {
        ApplicationContext applicationContext = KettleMiniServlet.applicationContext;
        Object getBeans = applicationContext.getBeanByReqPath(url);
        String methodName = applicationContext.getMethodNameByReqPath(url);

        if(getBeans != null && !"".equals(methodName.trim())){
            Method[] method = getBeans.getClass().getDeclaredMethods();
            for (int n = 0; n < method.length; n++) {
                String name = method[n].getName();
                if(name.equals(methodName.trim())){
                    Class[] paramTypes =  method[n].getParameterTypes();
                    Object[] orgs = new Object[paramTypes.length];
                    for(int i = 0 ;i<paramTypes.length;i++){
                        if(HttpServletRequest.class.getName().equals(paramTypes[i].getName())){
                            orgs[i] = request;
                        }else if(HttpServletResponse.class.getName().equals(paramTypes[i].getName())){
                            orgs[i] = response;
                        }else{
                            orgs[i] = null;
                        }
                    }
                    try {
                        Object invoke = method[n].invoke(getBeans, orgs);
                        //返回结果处理
                        if(invoke != null && CustomResult.class.getName().equals(invoke.getClass().getName())){
                            CustomResult invokeResult = (CustomResult) invoke;
                            invokeResult.setResponse(response);
                            invokeResult.msgStreamResult();
                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    } catch (InvocationTargetException e) {
                        e.printStackTrace();
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }else{
            System.out.println("ERROR");
        }
    }


    public static String returnJSONResult(String resultCode, Object content)
    {
        JSON.DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
        Map<String, Object> dataMap = new LinkedHashMap();
        dataMap.put("ResultCode", resultCode);
        dataMap.put("Content", content);
        return JSONArray.toJSONString(dataMap, SerializerFeature.WriteDateUseDateFormat);
    }


}
