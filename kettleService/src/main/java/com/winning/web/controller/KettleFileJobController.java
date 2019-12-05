package com.winning.web.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.winning.kettleMini.ModelResult.CustomResult;
import com.winning.kettleMini.beans.TaskTiming;
import com.winning.kettleMini.kettleManager.KettleLogManager;
import com.winning.kettleMini.kettleManager.KettleUtils;
import com.winning.web.beans.KettleFileJob;
import com.winning.web.service.KettleFileJobService;
import org.pentaho.di.core.logging.KettleLogStore;
import org.pentaho.di.job.Job;
import org.pentaho.di.trans.Trans;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

public class KettleFileJobController {


    private KettleFileJobService kettleFileJobService;


    public CustomResult saveKettleFileJob(HttpServletRequest request){
        String jobName = request.getParameter("jobName");
        String jobDetail = request.getParameter("jobDetail");
        String jobPath =  request.getParameter("jobPath");

        KettleFileJob kettleFileJob = new KettleFileJob();
        kettleFileJob.setId(UUID.randomUUID().toString());
        kettleFileJob.setJobName(jobName);
        kettleFileJob.setJobDetail(jobDetail);
        kettleFileJob.setJobPath(jobPath);
        try {
            kettleFileJobService.saveKettleFileJob(kettleFileJob);
            return new CustomResult("1","保存成功！");
        } catch (Exception e) {
            e.printStackTrace();
            return new CustomResult("2","保存失败！");
        }
    }




    public CustomResult queryFileJobs(HttpServletRequest request,HttpServletResponse response){
        String jobNameQuery = request.getParameter("jobNameQuery");
        String jobDetailQuery = request.getParameter("jobDetailQuery");
        String statusQuery = request.getParameter("statusQuery");
        KettleFileJob kettleFileJob = new KettleFileJob();
        kettleFileJob.setJobName(jobNameQuery);
        kettleFileJob.setJobDetail(jobDetailQuery);
        kettleFileJob.setStatus(statusQuery);
        try {
            List<KettleFileJob> kettleFileJobs = kettleFileJobService.queryKettleFileJob(kettleFileJob);
            return new CustomResult("1",kettleFileJobs);
        } catch (Exception e) {
            e.printStackTrace();
            return new CustomResult("2","查询失败！");
        }
    }


    public CustomResult renJob(HttpServletRequest request){
        String jobPath = request.getParameter("jobPath");
        String id = request.getParameter("id");
        if(jobPath.endsWith(".kjb")){
            Job job = KettleUtils.runKettleJob(jobPath);
            int lastLineNr = KettleLogStore.getLastBufferLineNr();
            String joblogStr = KettleLogStore.getAppender().getBuffer(job.getLogChannelId(), false,
                    0, lastLineNr ).toString();
            KettleLogManager.writeLogs(id,joblogStr);
        }else if(jobPath.endsWith(".ktr")){
            Trans trans = KettleUtils.runKettleTransfer(jobPath);
            int lastLineNr = KettleLogStore.getLastBufferLineNr();
            String joblogStr = KettleLogStore.getAppender().getBuffer(trans.getLogChannelId(), false,
                    0, lastLineNr ).toString();
            KettleLogManager.writeLogs(id,joblogStr);
        }
        return new CustomResult("1","执行完成！");
    }

    /**
     * 保存定时设置
     * @param request
     * @return
     */
    public CustomResult saveDssz(HttpServletRequest request){
        String id = request.getParameter("id");
        String lx = request.getParameter("lx");
        String msjg = request.getParameter("msjg");
        String fzsjg = request.getParameter("fzsjg");
        String xss = request.getParameter("xss");
        String ms = request.getParameter("ms");
        String zs = request.getParameter("zs");
        String ys = request.getParameter("ys");
        TaskTiming taskTiming = new TaskTiming();
        taskTiming.setFzsjg(fzsjg);
        taskTiming.setLx(lx);
        taskTiming.setMsjg(msjg);
        taskTiming.setXss(xss);
        taskTiming.setMs(ms);
        taskTiming.setZs(zs);
        taskTiming.setYs(ys);
        String taskTimingJson = JSONArray.toJSONString(taskTiming);
        try {
            kettleFileJobService.saveDssz(id,taskTimingJson);
            return new CustomResult("1","保存成功！");
        } catch (Exception e) {
            e.printStackTrace();
            return new CustomResult("2","保存失败！");
        }
    }


    public CustomResult startJob(HttpServletRequest request){
        String id = request.getParameter("id");
        String jobPath = request.getParameter("jobPath");
        String quartzJson = request.getParameter("quartzJson");
        try {
            kettleFileJobService.startJob(id,quartzJson,jobPath);
            return new CustomResult("1","启动成功！");
        } catch (Exception e) {
            return new CustomResult("2","启动失败！");
        }

    }


    public CustomResult stopJob(HttpServletRequest request){
        String id = request.getParameter("id");
        try {
            kettleFileJobService.stopJob(id);
            return new CustomResult("1","停用成功！");
        } catch (Exception e) {
            return new CustomResult("2","停用失败！");
        }

    }



    /**
     * 读取日志文件
     * @param request
     * @return
     */
    public CustomResult getLogs(HttpServletRequest request){
        String id = request.getParameter("id");
        return new CustomResult("1",KettleLogManager.readLogs(id));
    }




    public void setKettleFileJobService(KettleFileJobService kettleFileJobService) {
        this.kettleFileJobService = kettleFileJobService;
    }
}
