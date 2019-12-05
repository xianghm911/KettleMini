package com.winning.web.controller;

import com.alibaba.fastjson.JSONArray;
import com.winning.kettleMini.beans.FileTree;
import com.winning.kettleMini.kettleManager.KettleUtils;
import com.winning.kettleMini.kettleManager.ResourceManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;

public class KettleLogController {



    public void getLogTree(HttpServletResponse response,HttpServletRequest request) throws Exception{
        String jobid = request.getParameter("jobId");
        List<FileTree> kettleFileTrees = KettleUtils.getKettleLogFileTrees(ResourceManager.KETTLE_FILE_LOG_PATH,jobid);
        String returnValue  = JSONArray.toJSONString(kettleFileTrees);
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

    public void downloadLog(HttpServletResponse response,HttpServletRequest request) throws Exception{
        String path = request.getParameter("path");
        try {
            // path是指欲下载的文件的路径。
            File file = new File(path);
            // 取得文件名。
            String filename = file.getName();
            // 取得文件的后缀名。
            String ext = filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();

            // 以流的形式下载文件。
            InputStream fis = new BufferedInputStream(new FileInputStream(path));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            // 清空response
            response.reset();
            // 设置response的Header
            response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes()));
            response.addHeader("Content-Length", "" + file.length());
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            response.setContentType("application/octet-stream");
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }


}
