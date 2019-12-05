package com.winning.kettleMini.pico;

import org.picocontainer.MutablePicoContainer;
import org.picocontainer.defaults.DefaultPicoContainer;
import org.picocontainer.defaults.SetterInjectionComponentAdapterFactory;

public class ExtraPicoContainerProvider implements PicoContainerProvider {

    private MutablePicoContainer container;

    public ExtraPicoContainerProvider() {
        container = new DefaultPicoContainer(new SetterInjectionComponentAdapterFactory());
    }

    public void initContainer() {
        container.start();
    }

    public MutablePicoContainer getContainer() {
        return container;
    }

    public void registerComponent(Class c) {
        container.registerComponentImplementation(c);
    }

    public Object getComponnet(Class c) {
        return container.getComponentInstance(c);
    }


    public void destroyContainer() {
        container.start();
    }

}
