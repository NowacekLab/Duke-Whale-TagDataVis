import os  
from export_generic import export_single_generic
from plotly.io import read_json, write_html 

def html_exporter(file_path: str, target_dir: str):
  plotly_fig = read_json(file_path)
  file_name = os.path.splitext(os.path.basename(file_path))[0]   
  file_name_with_ext = f'{file_name}.html'
  new_path = os.path.join(target_dir, file_name_with_ext)
  write_html(plotly_fig, new_path)

def export_html_single(file_path: str, target_dir: str):
  return export_single_generic(html_exporter, file_path, target_dir)

def export_html_multiple(file_paths: str, target_dir: str):
  for file_path in file_paths:
    export_html_single(file_path, target_dir)