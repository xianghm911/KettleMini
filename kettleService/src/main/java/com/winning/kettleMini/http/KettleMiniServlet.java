package com.winning.kettleMini.http;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class KettleMiniServlet extends BaseServlet {

    @Override
    public void init() throws ServletException {
        super.init();
    }

    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String contextPath = request.getContextPath();
        String servletPath = request.getServletPath();
        String requestURI = request.getRequestURI();
        response.setCharacterEncoding("utf-8");
        if (contextPath == null) {
            contextPath = "";
        }
        String uri = contextPath + servletPath;
        String path = requestURI.substring(contextPath.length() + servletPath.length());
        if ("".equals(path))
        {
            if ((contextPath.equals("")) || (contextPath.equals("/"))) {
                response.sendRedirect("/kt/index.html");
            } else {
                response.sendRedirect("kt/index.html");
            }
            return;
        }
        if ("/".equals(path))
        {
            response.sendRedirect("index.html");
            return;
        }
        if (path.contains(".kt"))
        {
            String fullUrl = path;
            process2(fullUrl,request,response);
            return;
        }
        returnResourceFile(path, uri, response);
    }


}
