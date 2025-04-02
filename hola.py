import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QTextEdit, QPushButton,
    QVBoxLayout, QWidget, QFileDialog, QMessageBox
)
from bs4 import BeautifulSoup  # pip install beautifulsoup4

class TransformadorWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Transformador de Archivos a Texto")
        self.setGeometry(100, 100, 800, 600)
        
        # Crear widgets
        self.textEdit = QTextEdit()
        self.btnAbrir = QPushButton("Abrir archivos (máximo 3)")
        self.btnTransformar = QPushButton("Transformar a texto")
        self.btnGuardar = QPushButton("Guardar archivo")
        
        # Conectar señales a funciones
        self.btnAbrir.clicked.connect(self.abrir_archivos)
        self.btnTransformar.clicked.connect(self.transformar_texto)
        self.btnGuardar.clicked.connect(self.guardar_archivo)
        
        # Definir layout
        layout = QVBoxLayout()
        layout.addWidget(self.btnAbrir)
        layout.addWidget(self.textEdit)
        layout.addWidget(self.btnTransformar)
        layout.addWidget(self.btnGuardar)
        
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)
        
        # Lista para guardar los datos de los archivos seleccionados
        self.files_data = []
    
    def abrir_archivos(self):
        filepaths, _ = QFileDialog.getOpenFileNames(
            self, "Abrir archivos", "",
            "Archivos soportados (*.html *.htm *.js *.css *.py);;Todos los archivos (*)"
        )
        if filepaths:
            if len(filepaths) > 100:
                QMessageBox.warning(self, "Advertencia", "Seleccione máximo 3 archivos.")
                return
            
            self.files_data = []
            for filepath in filepaths:
                try:
                    with open(filepath, 'r', encoding='utf-8') as file:
                        content = file.read()
                    self.files_data.append({'filename': filepath, 'content': content})
                except Exception as e:
                    QMessageBox.critical(self, "Error", f"Error al abrir el archivo {filepath}:\n{e}")
            
            if self.files_data:
                info = "\n".join([f"Archivo: {os.path.basename(f['filename'])}" for f in self.files_data])
                self.textEdit.setText(info)
    
    def transformar_texto(self):
        if not self.files_data:
            QMessageBox.information(self, "Información", "No hay archivos cargados para transformar.")
            return
        
        transformed_result = ""
        for file in self.files_data:
            filename = file['filename']
            content = file['content']
            ext = os.path.splitext(filename)[1].lower()
            if ext in ['.html', '.htm']:
                # Para archivos HTML, extraer solo el texto visible
                soup = BeautifulSoup(content, 'html.parser')
                transformed = soup.get_text()
            else:
                # Para .js, .css y .py se conserva el contenido original
                transformed = content
            
            transformed_result += f"--- Archivo: {os.path.basename(filename)} ---\n{transformed}\n\n"
        
        self.textEdit.setText(transformed_result)
    
    def guardar_archivo(self):
        filename, _ = QFileDialog.getSaveFileName(
            self, "Guardar archivo transformado", "",
            "Archivos de texto (*.txt);;Todos los archivos (*)"
        )
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as file:
                    file.write(self.textEdit.toPlainText())
                QMessageBox.information(self, "Guardado", "Archivo guardado exitosamente.")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error al guardar el archivo:\n{e}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TransformadorWindow()
    window.show()
    sys.exit(app.exec())
