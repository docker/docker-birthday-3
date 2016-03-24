import psycopg2

try:
    conn = psycopg2.connect("dbname='postgres' user='postgres' host='localhost' port=5003 password='dbpass'")
except:
    print "I am unable to connect to the database"


def get_votes(option):
    cur = conn.cursor()
    cur.execute("""SELECT count(vote) from votes where vote=%(opt)s""", {"opt": option})
    result = cur.fetchone()
    return result[0]


def clear_votes(option):
    cur = conn.cursor()
    cur.execute("""delete from votes where vote=%(opt)s""", {"opt": option})
    conn.commit()
