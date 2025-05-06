import psycopg2
import json
from datetime import datetime
import os
from dotenv import load_dotenv

def insertar_calendario():
    # Cargar variables de entorno
    load_dotenv()

    conexion = psycopg2.connect(
        dbname=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_HOST'),
        port="5432"
    )

    cursor = conexion.cursor()

    try:
        # Leer el archivo JSON
        with open('calendario.json', 'r', encoding='utf-8') as file:
            partidos = json.load(file)

        # Insertar cada partido en la base de datos
        for partido in partidos:
            cursor.execute('''
                INSERT INTO Partidos (
                    fecha_partido,
                    hora_partido,
                    equipo_local_id,
                    equipo_visitante_id,
                    goles_local,
                    goles_visitante,
                    id_estadio,
                    id_arbitro,
                    id_liga,
                    jornada
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                partido['fecha_partido'],
                partido['hora_partido'],
                partido['equipo_local_id'],
                partido['equipo_visitante_id'],
                partido['goles_local'],
                partido['goles_visitante'],
                partido['id_estadio'],
                partido['id_arbitro'],
                partido['id_liga'],
                partido['jornada']
            ))

        # Confirmar los cambios
        conexion.commit()
        print("✅ Calendario insertado correctamente en la base de datos")

    except Exception as e:
        # En caso de error, deshacer los cambios
        conexion.rollback()
        print(f"❌ Error al insertar el calendario: {str(e)}")

    finally:
        # Cerrar la conexión
        cursor.close()
        conexion.close()

if __name__ == "__main__":
    insertar_calendario()
