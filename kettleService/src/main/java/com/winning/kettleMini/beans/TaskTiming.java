package com.winning.kettleMini.beans;

import org.apache.commons.lang.StringUtils;

public class TaskTiming {

    private String lx = "1";

    private String msjg = "0";

    private String fzsjg = "0";

    private String xss = "0";

    private String ms = "0";

    private String zs = "1";

    private String ys = "1";


    public String getLx() {
        if(StringUtils.isBlank(lx))
            return "1";
        return lx;
    }

    public void setLx(String lx) {
        this.lx = lx;
    }

    public String getMsjg() {
        if(StringUtils.isBlank(msjg))
            return "0";
        return msjg;
    }

    public void setMsjg(String msjg) {
        this.msjg = msjg;
    }

    public String getFzsjg() {
        if(StringUtils.isBlank(fzsjg))
            return "0";
        return fzsjg;
    }

    public void setFzsjg(String fzsjg) {
        this.fzsjg = fzsjg;
    }

    public String getXss() {
        if(StringUtils.isBlank(xss))
            return "0";
        return xss;
    }

    public void setXss(String xss) {
        this.xss = xss;
    }

    public String getMs() {
        if(StringUtils.isBlank(ms))
            return "0";
        return ms;
    }

    public void setMs(String ms) {
        this.ms = ms;
    }

    public String getZs() {
        if(StringUtils.isBlank(zs))
            return "1";
        return zs;
    }

    public void setZs(String zs) {
        this.zs = zs;
    }

    public String getYs() {
        if(StringUtils.isBlank(ys))
            return "1";
        return ys;
    }

    public void setYs(String ys) {
        this.ys = ys;
    }
}
