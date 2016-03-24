import psycopg2


class Db:
    def __init__(self, host, port, user, password, db):
        try:
            self.conn = psycopg2.connect(
                "dbname='%s' user='%s' host='%s' port=%d password='%s'" % (db, user, host, port, password))
        except:
            print "I am unable to connect to the database"

    def get_votes(self, option):
        cur = self.conn.cursor()
        cur.execute("""SELECT count(vote) from votes where vote=%(opt)s""", {"opt": option})
        result = cur.fetchone()
        return result[0]

    def clear_votes(self, option):
        cur = self.conn.cursor()
        cur.execute("""delete from votes where vote=%(opt)s""", {"opt": option})
        self.conn.commit()
