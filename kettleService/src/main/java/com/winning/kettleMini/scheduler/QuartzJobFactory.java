package com.winning.kettleMini.scheduler;

import com.winning.kettleMini.kettleManager.KettleLogManager;
import com.winning.kettleMini.kettleManager.KettleUtils;
import com.winning.web.beans.KettleFileJob;
import org.pentaho.di.core.logging.KettleLogStore;
import org.pentaho.di.trans.Trans;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class QuartzJobFactory implements Job {


    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            KettleFileJob job2 = (KettleFileJob)context.getJobDetail().getJobDataMap().get("scheduleJob");
            String id = job2.getId();
            String jobPath = job2.getJobPath();
            if(jobPath.endsWith(".kjb")){
                org.pentaho.di.job.Job job = KettleUtils.runKettleJob(jobPath);
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
        }catch (Exception e) {
        }
    }

}
