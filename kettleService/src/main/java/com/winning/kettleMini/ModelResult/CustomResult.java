package com.winning.kettleMini.ModelResult;

import com.winning.kettleMini.httpService.KtRequestService;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;

/**
 * 自定义返回结果模型类
 */
public class CustomResult {

        private HttpServletResponse response;

        private String resultCode ;

        private Object resultObj;

        public CustomResult(){

        }

        public CustomResult(String resultCode,Object resultObj) {
           this.resultCode = resultCode;
           this.resultObj = resultObj;
         }

        public void setResponse(HttpServletResponse response) {
            this.response = response;
        }

        public  void msgStreamResult() throws Exception{
            String returnValue  = KtRequestService.returnJSONResult(resultCode,resultObj);
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            response.setHeader("Content-Type", "text/html;charset=utf-8");
            OutputStream os = response.getOutputStream();
            if (returnValue == null) returnValue = "";
            os.write(((String) returnValue).getBytes("utf-8"));
            os.flush();
            os.close();
        }

}
