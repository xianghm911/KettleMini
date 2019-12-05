package com.winning.kettleMini.kettleManager;

import com.winning.kettleMini.beans.FileTree;
import org.apache.commons.lang.StringUtils;
import org.pentaho.di.core.KettleClientEnvironment;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.exception.KettleMissingPluginsException;
import org.pentaho.di.core.exception.KettleXMLException;
import org.pentaho.di.job.Job;
import org.pentaho.di.job.JobMeta;
import org.pentaho.di.trans.Trans;
import org.pentaho.di.trans.TransMeta;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * kettle工具
 */
public class KettleUtils {

    public static List<String>  fileTypes = new ArrayList<>();
    public static String KTR = ".ktr";
    public static String KJB = ".kjb";


    static {
        fileTypes.add(KTR);
        fileTypes.add(KJB);
    }

    /**
     * 初始化kettle容器
     * @throws KettleException
     */
    public static void initEnv() throws KettleException {
        System.setProperty("javax.xml.parsers.DocumentBuilderFactory", "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
        if (!KettleEnvironment.isInitialized()) {
            KettleEnvironment.init();
            KettleClientEnvironment.getInstance().setClient(KettleClientEnvironment.ClientType.SPOON);
        }
    }

    public static void destoryEnv()  {
        KettleEnvironment.shutdown();
    }

    /**
     * 执行job
     * @param kjbFilePath
     * @param kjbFilePath
     * @return
     */
    public static Job runKettleJob(String kjbFilePath) {
            //初始化job路径
        JobMeta jobMeta = null;
        try {
            jobMeta = new JobMeta(kjbFilePath, null);
        } catch (KettleXMLException e) {
            e.printStackTrace();
        }
        Job job = new Job(null, jobMeta);
        //开始执行
        job.start();
        //等待转换执行结束
        job.waitUntilFinished();
        if (job.getErrors() > 0) {
            System.out.println("执行失败");
        }else{
            System.out.println("执行成功");
        }
        return job;
    }

    /**
     * 执行Transfer
     * @param ktrFilePath 路径
     * @return
     */
    public static Trans runKettleTransfer(String ktrFilePath) {
            //初始化
        TransMeta transMeta = null;
        try {
            transMeta = new TransMeta(ktrFilePath);
        } catch (KettleXMLException e) {
            e.printStackTrace();
        } catch (KettleMissingPluginsException e) {
            e.printStackTrace();
        }
        //转换
        Trans trans = new Trans(transMeta);
        //初始化trans参数，脚本中获取参数值：${variableName}
        //执行转换
        try {
            trans.execute(null);//这个方法可以设置命令行参数
        } catch (KettleException e) {
            e.printStackTrace();
        }
        //等待转换执行结束
        trans.waitUntilFinished();
        if (trans.getErrors() > 0) {
            System.out.println("执行失败");
        }else{
            System.out.println("执行成功");
        }
        return trans;
    }


    public static List<FileTree> getKettleFileTrees(String KettleFilePath){
        Set<String> hasFilePath = new HashSet<>();
        List<FileTree> fileTrees = getKettleFileTrees_(KettleFilePath,hasFilePath);
        List<FileTree> fileTreesRemove = new ArrayList<>();
        for (FileTree fileTree : fileTrees) {
                if(!hasFilePath.contains(fileTree.getFilePath())){
                    fileTreesRemove.add(fileTree);
                }
        }
        fileTrees.removeAll(fileTreesRemove);
        return fileTrees;
    }



    public static List<FileTree>  getKettleFileTrees_(String KettleFilePath,Set<String> hasFilePath ){
        List<FileTree>  fileTrees = new ArrayList<>();
        File kettlePath = new File(KettleFilePath);
        if(kettlePath.exists() && kettlePath.isDirectory()){
            FileTree fileTree = new FileTree();
            fileTree.setId(kettlePath.getPath());
            fileTree.setText(kettlePath.getName());
            fileTree.setFilePath(kettlePath.getPath());
            fileTrees.add(fileTree);
            File[] childFiles = kettlePath.listFiles();
            for (File childFile : childFiles) {
                if(childFile.isDirectory()){
                    getKettleFileTrees(fileTrees,childFile,hasFilePath);
                }else if(!childFile.getName().endsWith(KJB) && !childFile.getName().endsWith(KTR)){
                    continue;
                }else{
                    hasFilePath.add(kettlePath.getPath());
                    hasFilePath.add(childFile.getPath());
                }
                FileTree fileTree2 = new FileTree();
                fileTree2.setId(childFile.getPath());
                fileTree2.setText(childFile.getName());
                fileTree2.setPid(kettlePath.getPath());
                fileTree2.setFilePath(childFile.getPath());
                fileTrees.add(fileTree2);
            }
        }
        return fileTrees;
    }


    public static void getKettleFileTrees( List<FileTree>  fileTrees ,File kettlePath,Set<String> hasFilePath){
        if(kettlePath.exists() && kettlePath.isDirectory()){
            File[] childFiles = kettlePath.listFiles();
            for (File childFile : childFiles) {
                if(childFile.isDirectory()){
                    getKettleFileTrees(fileTrees,childFile,hasFilePath);
                }else if(!childFile.getName().endsWith(KJB) && !childFile.getName().endsWith(KTR)){
                    break;
                }else{
                    hasFilePath.add(kettlePath.getPath());
                    hasFilePath.add(childFile.getPath());
                }
                FileTree fileTree = new FileTree();
                fileTree.setId(childFile.getPath());
                fileTree.setText(childFile.getName());
                fileTree.setPid(kettlePath.getPath());
                fileTree.setFilePath(childFile.getPath());
                fileTrees.add(fileTree);
            }
        }
    }



    //-------------------------------------


    public static List<FileTree> getKettleLogFileTrees(String KettleFilePath,String jobid){
        Set<String> hasFilePath = new HashSet<>();
        List<FileTree> fileTrees = getKettleLogFileTrees_(KettleFilePath,hasFilePath,jobid);
        return fileTrees;
    }



    public static List<FileTree>  getKettleLogFileTrees_(String KettleFilePath,Set<String> hasFilePath,String jobId ){
        List<FileTree>  fileTrees = new ArrayList<>();
        File kettlePath = new File(KettleFilePath);
        if(kettlePath.exists() && kettlePath.isDirectory()){
            FileTree fileTree = new FileTree();
            fileTree.setId(kettlePath.getPath());
            fileTree.setText(kettlePath.getPath());
            fileTree.setFilePath(kettlePath.getPath());
            fileTrees.add(fileTree);
            File[] childFiles = kettlePath.listFiles();
            for (File childFile : childFiles) {
                if(StringUtils.isNotBlank(jobId)){
                   if( childFile.getName().indexOf(jobId) != -1){
                       if(childFile.isDirectory()){
                           getKettleLogFileTrees(fileTrees,childFile,hasFilePath);
                       }else{
                           hasFilePath.add(kettlePath.getPath());
                           hasFilePath.add(childFile.getPath());
                       }
                       FileTree fileTree2 = new FileTree();
                       fileTree2.setId(childFile.getPath());
                       if(childFile.isDirectory()){
                           fileTree2.setText(childFile.getName());
                       }else{
                           fileTree2.setText(childFile.getName()+"   <a href='klog/downloadLog.kt?path="+childFile.getPath()+"'>下载</a>");
                       }
                       fileTree2.setPid(kettlePath.getPath());
                       fileTree2.setFilePath(childFile.getPath());
                       fileTrees.add(fileTree2);
                   }
                }else{
                    if(childFile.isDirectory()){
                        getKettleLogFileTrees(fileTrees,childFile,hasFilePath);
                    }else{
                        hasFilePath.add(kettlePath.getPath());
                        hasFilePath.add(childFile.getPath());
                    }
                    FileTree fileTree2 = new FileTree();
                    fileTree2.setId(childFile.getPath());
                    if(childFile.isDirectory()){
                        fileTree2.setText(childFile.getName());
                    }else{
                        fileTree2.setText(childFile.getName()+"   <a href='klog/downloadLog.kt?path="+childFile.getPath()+"'>下载</a>");
                    }
                    fileTree2.setPid(kettlePath.getPath());
                    fileTree2.setFilePath(childFile.getPath());
                    fileTrees.add(fileTree2);
                }
            }
        }
        return fileTrees;
    }


    public static void getKettleLogFileTrees( List<FileTree>  fileTrees ,File kettlePath,Set<String> hasFilePath){
        if(kettlePath.exists() && kettlePath.isDirectory()){
            File[] childFiles = kettlePath.listFiles();
            for (File childFile : childFiles) {
                if(childFile.isDirectory()){
                    getKettleLogFileTrees(fileTrees,childFile,hasFilePath);
                }else{
                    hasFilePath.add(kettlePath.getPath());
                    hasFilePath.add(childFile.getPath());
                }
                FileTree fileTree = new FileTree();
                fileTree.setId(childFile.getPath());
                if(childFile.isDirectory()){
                    fileTree.setText(childFile.getName());
                }else{
                    fileTree.setText(childFile.getName()+ "   <a  href='klog/downloadLog.kt?path="+childFile.getPath()+"'>下载</a>");
                }
                fileTree.setPid(kettlePath.getPath());
                fileTree.setFilePath(childFile.getPath());
                fileTrees.add(fileTree);
            }
        }
    }

}
