package com.winning.kettleMini.kettleManager;

import com.google.common.util.concurrent.SettableFuture;
import org.pentaho.di.core.*;
import org.pentaho.di.core.auth.AuthenticationConsumerPluginType;
import org.pentaho.di.core.auth.AuthenticationProviderPluginType;
import org.pentaho.di.core.compress.CompressionPluginType;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.exception.KettlePluginException;
import org.pentaho.di.core.lifecycle.KettleLifecycleSupport;
import org.pentaho.di.core.logging.LogTablePluginType;
import org.pentaho.di.core.plugins.*;
import org.pentaho.di.i18n.BaseMessages;
import org.pentaho.di.repository.IUser;
import org.pentaho.di.repository.Repository;
import org.pentaho.di.trans.step.RowDistributionPluginType;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicReference;

public class KettleEnvironment {
    private static Class<?> PKG = Const.class;
    private static AtomicReference<SettableFuture<Boolean>> initialized = new AtomicReference((Object)null);
    private static KettleLifecycleSupport kettleLifecycleSupport;

    public KettleEnvironment() {
    }

    public static void init() throws KettleException {
        init(true);
    }

    public static void init(Class<? extends PluginTypeInterface> pluginClasses) {
    }

    public static void init(boolean simpleJndi) throws KettleException {
        init(Arrays.asList(RowDistributionPluginType.getInstance(), StepPluginType.getInstance(), PartitionerPluginType.getInstance(), JobEntryPluginType.getInstance(), LogTablePluginType.getInstance(), RepositoryPluginType.getInstance(), LifecyclePluginType.getInstance(), KettleLifecyclePluginType.getInstance(), ImportRulePluginType.getInstance(), CartePluginType.getInstance(), CompressionPluginType.getInstance(), AuthenticationProviderPluginType.getInstance(), AuthenticationConsumerPluginType.getInstance(), EnginePluginType.getInstance()), simpleJndi);
    }

    public static void init(List<PluginTypeInterface> pluginClasses, boolean simpleJndi) throws KettleException {
        SettableFuture ready;
        if (initialized.compareAndSet(null, ready = SettableFuture.create())) {
            try {
                if (!KettleClientEnvironment.isInitialized()) {
                    KettleClientEnvironment.init();
                }

                if (simpleJndi) {
                    JndiUtil.initJNDI();
                }

                pluginClasses.forEach(PluginRegistry::addPluginType);
                PluginRegistry.init();
                KettleVariablesList.init();
                //initLifecycleListeners();
                ready.set(true);
            } catch (Throwable var4) {
                ready.setException(var4);
                throw var4 instanceof KettleException ? (KettleException)var4 : new KettleException(var4);
            }
        } else {
            ready = (SettableFuture)initialized.get();

            try {
                ready.get();
            } catch (Throwable var5) {
                throw var5 instanceof KettleException ? (KettleException)var5 : new KettleException(var5);
            }
        }

    }

    private static void initLifecycleListeners() throws KettleException {
        kettleLifecycleSupport = new KettleLifecycleSupport();
        kettleLifecycleSupport.onEnvironmentInit();
        final KettleLifecycleSupport s = kettleLifecycleSupport;
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                KettleEnvironment.shutdown(s);
            }
        });
    }

    public static void shutdown() {
        shutdown(kettleLifecycleSupport);
    }

    private static void shutdown(KettleLifecycleSupport kettleLifecycleSupport) {
        try {
            kettleLifecycleSupport.onEnvironmentShutdown();
        } catch (Throwable var2) {
            System.err.println(BaseMessages.getString(PKG, "LifecycleSupport.ErrorInvokingKettleEnvironmentShutdownListeners", new String[0]));
            var2.printStackTrace();
        }

    }

    public static boolean isInitialized() {
        Future future = (Future)initialized.get();

        try {
            return future != null && ((Boolean)future.get()).booleanValue();
        } catch (Throwable var2) {
            return false;
        }
    }

    public void loadPluginRegistry() throws KettlePluginException {
    }

    public static void setExecutionInformation(ExecutorInterface executor, Repository repository) {
        executor.setExecutingUser(System.getProperty("user.name"));
        if (repository != null) {
            IUser userInfo = repository.getUserInfo();
            if (userInfo != null) {
                executor.setExecutingUser(userInfo.getLogin());
            }
        }

    }
}
