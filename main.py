import os,zipfile
import shutil
from PyQt5 import uic
from PyQt5 import *
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
import sys,json

global path
path = os.path.split(os.path.realpath(__file__))[0]

class Bcm_to_App(QWidget):
    def __init__(self):
        super(Bcm_to_App, self).__init__()
        uic.loadUi(path+'/gui.ui', self)

        self.pushButton.clicked.connect(self.onClick1)
        self.pushButton_2.clicked.connect(self.onClick2)
        self.pushButton_3.clicked.connect(self.onClick3)
        self.pushButton_4.clicked.connect(self.onClick4)
        self.pushButton_5.clicked.connect(self.onClick5) 
        self.label_4.setHidden(True)
        self.pushButton_4.setHidden(True)
        self.label_5.setHidden(True)
        self.label_6.setHidden(True)
        self.label_7.setHidden(True)
        self.label_8.setHidden(True)
        self.ismoving = False
        global aboutus
        aboutus = False

        self.pushButton.setStyleSheet("QPushButton{border-color: rgb(0, 0, 0);\nbackground-color: rgb(250,154,75);\ncolor: rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}"
                                                   "QPushButton:hover{border-color: rgb(0, 0, 0);\nbackground-color:rgb(248, 136, 36);\ncolor:  rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}")
        self.pushButton_2.setStyleSheet("QPushButton{border-color: rgb(0, 0, 0);\nbackground-color: rgb(255, 255, 255);\ncolor: rgb(255, 255, 255);\nborder-radius: 2px;\npadding: 8;}"
                                                   "QPushButton:hover{border-color: rgb(0, 0, 0);\nbackground-color:rgb(255,250,243);\ncolor:  rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}")
        self.pushButton_3.setStyleSheet("QPushButton{border-color: rgb(0, 0, 0);\nbackground-color: rgb(255, 255, 255);\ncolor: rgb(255, 255, 255);\nborder-radius: 2px;\npadding: 8;}"
                                                   "QPushButton:hover{border-color: rgb(0, 0, 0);\nbackground-color:rgb(255,250,243);\ncolor:  rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}")
        self.pushButton_4.setStyleSheet("QPushButton{border-color: rgb(0, 0, 0);\nbackground-color: rgb(250,154,75);\ncolor: rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}"
                                                   "QPushButton:hover{border-color: rgb(0, 0, 0);\nbackground-color:rgb(248, 136, 36);\ncolor:  rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}")
        self.pushButton_5.setStyleSheet("QPushButton{border-color: rgb(0, 0, 0);\nbackground-color: rgb(255, 255, 255);\ncolor: rgb(255, 255, 255);\nborder-radius: 2px;\npadding: 8;}"
                                                   "QPushButton:hover{border-color: rgb(0, 0, 0);\nbackground-color:rgb(255,250,243);\ncolor:  rgb(255, 255, 255);\nborder-radius: 5px;\npadding: 8;}")
        self.setWindowFlags(Qt.FramelessWindowHint)

    def onClick1(self):
        fileName = QFileDialog.getOpenFileName(self, "选取文件", os.getcwd(), "Kitten3 Files(*.bcm)")[0]
        if fileName != "":
            main(fileName)
            self.label_4.setHidden(False)
            self.pushButton.setHidden(True)
            self.pushButton_4.setHidden(False)
    
    def onClick2(self):
        global aboutus
        if aboutus:
            self.label_5.setHidden(True)
            self.label_6.setHidden(True)
            self.label_7.setHidden(True)
            self.label_8.setHidden(True)
            aboutus = False
        else:
            self.close()
    
    def onClick3(self):
        global aboutus
        aboutus = True
        self.label_5.setHidden(False)
        self.label_6.setHidden(False)
        self.label_7.setHidden(False)
        self.label_8.setHidden(False)

    def onClick4(self):        
        self.label_4.setHidden(True)
        self.pushButton.setHidden(False)
        self.pushButton_4.setHidden(True)

    def onClick5(self):
        self.setWindowFlag(Qt.FramelessWindowHint,False)
        self.showMinimized()

    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton:
            self.ismoving = True
            self.start_point = e.globalPos()
            self.window_point = self.frameGeometry().topLeft()
    
    def mouseMoveEvent(self, e):
        if self.ismoving:
            relpos = e.globalPos() - self.start_point
            self.move(self.window_point + relpos)

    def mouseReleaseEvent(self,e):
        self.ismoving = False

    def changeEvent(self, event):
        if event.type() == QEvent.WindowStateChange:
            if self.isMinimized():
                pass
            else:
                self.setWindowFlag(Qt.FramelessWindowHint,True)
                self.showNormal()

def app(zfile,folder,baseDir=""):
    fileList=os.listdir(folder)
    for file in fileList:
        if os.path.isfile(os.path.join(folder,file)):
            zfile.write(os.path.join(folder,file),os.path.join(baseDir,file))
        else:
            zfile.write(os.path.join(folder,file),baseDir+"/"+file)
            app(zfile,os.path.join(folder,file),baseDir=os.path.join(baseDir,file))


def main(bcm_file_path):
    shutil.copyfile(bcm_file_path,path+'/important_file/bcm_file/resource.bcm')
    with open(path+'/important_file/bcm_file/resource.bcm',encoding="UTF-8") as fff:
        a = json.load(fff)
        width = a['width']
        height = a['height']
        if width == 960 and height == 720:
            width = 840
            height = 666
        elif width == 620 and height == 900:
            width = 434
            height = 666
        else:
            width = 840
            height = 510
    with open(path+'/important_file/bcm_file/package.json',encoding="UTF-8") as f:
        www = json.load(f)
        www['window']['width'] = width
        www['window']['height'] = height
    with open(path+'/important_file/bcm_file/package.json','w',encoding="UTF-8") as f_i:
        json.dump(www, f_i)
    app(zipfile.ZipFile(path+'/app.nw','w'),path+'/important_file/bcm_file',baseDir="")
    try:
        shutil.move(path+'/app.nw',path+'/important_file/nwjs.app/Contents/Resources/')
    except shutil.Error:
        os.remove(path+'/important_file/nwjs.app/Contents/Resources/app.nw')
        shutil.move(path+'/app.nw',path+'/important_file/nwjs.app/Contents/Resources/')
    try:
        shutil.copytree(path+'/important_file/nwjs.app/',os.path.join(os.path.expanduser('~'),"Desktop")+'/'+os.path.split(os.path.splitext(bcm_file_path)[0])[1]+'.app/')
    except FileExistsError:
        shutil.rmtree(os.path.join(os.path.expanduser('~'),"Desktop")+'/'+os.path.split(os.path.splitext(bcm_file_path)[0])[1]+'.app/')
        shutil.copytree(path+'/important_file/nwjs.app/',os.path.join(os.path.expanduser('~'),"Desktop")+'/'+os.path.split(os.path.splitext(bcm_file_path)[0])[1]+'.app/')
    os.remove(path+'/important_file/nwjs.app/Contents/Resources/app.nw')
    os.remove(path+'/important_file/bcm_file/resource.bcm')

def show_Bcm_to_App():
    app = QApplication(sys.argv)
    bcm_to_app = Bcm_to_App()
    bcm_to_app.show()
    sys.exit(app.exec())


if __name__ == '__main__':
    show_Bcm_to_App()
