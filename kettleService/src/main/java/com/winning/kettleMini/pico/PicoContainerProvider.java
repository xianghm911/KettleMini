package com.winning.kettleMini.pico;

import org.picocontainer.PicoContainer;

public interface PicoContainerProvider {

    void initContainer();

    PicoContainer getContainer();

    void registerComponent(Class c);

    Object getComponnet(Class c);

    void destroyContainer();
}
