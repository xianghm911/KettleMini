package com.winning.kettleMini.http;

import com.winning.kettleMini.httpService.KtRequestService;
import com.winning.kettleMini.ioc.ApplicationContext;
import com.winning.kettleMini.ioc.ClassPathXMLApplicationContext;
import com.winning.kettleMini.kettleManager.KettleUtils;
import com.winning.kettleMini.pico.ExtraPicoContainerProvider;
import com.winning.kettleMini.pico.PicoContainerProvider;
import com.winning.kettleMini.utils.Utils;
import org.pentaho.di.core.exception.KettleException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public abstract  class BaseServlet  extends HttpServlet {

    protected final String resourcePath = "support/http/resourceKt";

    public static ApplicationContext applicationContext ;

    public static PicoContainerProvider picoContainerProvider;

    private KtRequestService ktService = KtRequestService.getInstance();

    public void init() throws ServletException {
        picoContainerProvider = new ExtraPicoContainerProvider();
        //初始化容器
        applicationContext = new ClassPathXMLApplicationContext(picoContainerProvider);
        picoContainerProvider.initContainer();
        try {
            KettleUtils.initEnv();
        } catch (KettleException e) {
            e.printStackTrace();
        }
    }

    protected String process(String url, HttpServletRequest request, HttpServletResponse response)
    {
        String resp = null;
        {
            //resp = ktService.service(url,request,response);
        }
        return resp;
    }

    protected void process2(String url, HttpServletRequest request, HttpServletResponse response)
    {
         ktService.service(url,request,response);
    }

    protected void returnResourceFile(String fileName, String uri, HttpServletResponse response)
            throws ServletException, IOException
    {
        String filePath = getFilePath(fileName);
        if (filePath.endsWith(".html")) {
            response.setContentType("text/html; charset=utf-8");
        }
        if (fileName.endsWith(".jpg"))
        {
            byte[] bytes = Utils.readByteArrayFromResource(filePath);
            if (bytes != null) {
                response.getOutputStream().write(bytes);
            }
            return;
        }
        if (fileName.endsWith(".gif"))
        {
            byte[] bytes = Utils.readByteArrayFromResource(filePath);
            if (bytes != null) {
                response.getOutputStream().write(bytes);
            }
            return;
        }
        if (fileName.endsWith(".json"))
        {
            byte[] bytes = Utils.readByteArrayFromResource(filePath);
            if (bytes != null) {
                response.getOutputStream().write(bytes);
            }
            return;
        }
        if (fileName.endsWith(".png"))
        {
            byte[] bytes = Utils.readByteArrayFromResource(filePath);
            if (bytes != null) {
                response.getOutputStream().write(bytes);
            }
            return;
        }
        String text = Utils.readFromResource(filePath);
        if (text == null)
        {
            response.sendRedirect(uri + "/index.html");
            return;
        }
        if (fileName.endsWith(".css")) {
            response.setContentType("text/css;charset=utf-8");
        } else if (fileName.endsWith(".js")) {
            response.setContentType("text/javascript;charset=utf-8");
        }
        response.getWriter().write(text);
    }


    protected String getFilePath(String fileName)
    {
        return this.resourcePath + fileName;
    }

    @Override
    public void destroy() {
        picoContainerProvider.destroyContainer();
        KettleUtils.destoryEnv();
    }
}
