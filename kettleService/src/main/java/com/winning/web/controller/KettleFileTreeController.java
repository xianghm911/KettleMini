package com.winning.web.controller;

import com.alibaba.fastjson.JSONArray;
import com.winning.kettleMini.beans.FileTree;
import com.winning.kettleMini.kettleManager.KettleUtils;
import com.winning.kettleMini.kettleManager.ResourceManager;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.List;

public class KettleFileTreeController {

    public void getKettleFileTree(HttpServletResponse response) throws Exception{
        List<FileTree> kettleFileTrees = KettleUtils.getKettleFileTrees(ResourceManager.KETTLE_FILE_PATH);
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

}
