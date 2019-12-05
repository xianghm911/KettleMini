package com.winning.kettleMini.Exception;

/**
 * 系统自定义异常
 */
public class BaseException extends Exception {

    private String excpMsgStr = null;

    private String excpCode = null;

    private Exception causeException = null;

    public BaseException() {

    }

    public BaseException(String excpMsgStr) {
        this.excpMsgStr = excpMsgStr;
    }

    public BaseException(String excpMsgStr, String excpCode) {
        this.excpMsgStr = excpMsgStr;
        this.excpCode = excpCode;
    }

    public Exception getCauseException() {
        return causeException;
    }

    public void setCauseException(Exception causeException) {
        this.causeException = causeException;
    }

    public String getExcpCode() {
        return excpCode;
    }

    public void setExcpCode(String excpCode) {
        this.excpCode = excpCode;
    }

    public String getExcpMsgStr() {
        return excpMsgStr;
    }

    public void setExcpMsgStr(String excpMsgStr) {
        this.excpMsgStr = excpMsgStr;
    }


}
