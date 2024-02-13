<script setup>
import { desktopDir } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
</script>

<template>
  <div id="aboutUs">
    <div class="navbar" data-tauri-drag-region></div>
    <div id="version">
      <div id="pic"></div>
      <p class="bold">版本号：v2.0.0</p>
      <a href="https://shequ.codemao.cn/user/438403">小鱼yuzifu</a>
    </div>
    <div id="intro">
      <p>关于格式工厂你需要知道：</p>
      <div style="margin-block: 25px"></div>
      <p class="bold">1.生成的程序无法运行/找不到文件存放位置。</p>
      <p class="space">
        答：如果无法打开，则为软件bug。可联系作者。文件存放位置Windows/Mac OS在桌面上，
      </p>
      <p class="space">
        而Linux在用户home目录下。<span
          id="place"
          @click="
            async () => {
              await invoke('open_file', { path: await desktopDir() })
            }
          "
          >点我查看文件位置！</span
        >
      </p>
      <br />
      <p class="bold">2.转换后的应用程序大小远远大于bcm文件大小。</p>
      <p class="space">
        答：为了让bcm独立运行，需要很多其他文件的支持，这部分程序也是占空间的。因此APP文件
      </p>
      <p class="space">至少也有200MB左右。</p>
      <br />
      <p class="bold">3.为什么离线模式下云变量作品无法使用。</p>
      <p class="space">
        答：在编程猫中，云变量的使用是需要确定的作品ID的，但转换的文件并没有对应的作品ID，因此云
      </p>
      <p class="space">
        变量的功能在转换的文件中是无法使用的，将会作为普通变量运行。（但可以使用在线转换）
      </p>
      <br />
      <p class="bold">4.关于安卓APK。</p>
      <p class="space">
        答：嗯，不会出了...（试着用用<a href="https://coco.codemao.cn/">CoCo编辑器？</a>）
      </p>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  background-color: transparent;
  width: 100vw;
  height: 40px;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
