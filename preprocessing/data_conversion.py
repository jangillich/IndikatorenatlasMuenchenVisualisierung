import numpy as np
import functions as f

import codecs




csv = "../csv/indikatorenatlas2014bevoelkerungauslaenderinnenanteil.csv"
csv2 = "../csv/indikatorenatlas2014bevoelkerungeinpersonenhaushalte.csv"
csv3 = "../csv/indikatorenatlas2014bevoelkerungmittlerelebenserwartung.csv"
csv4 = "../csv/indikatorenatlas2014bevoelkerungeinwohnerdichte.csv"

dtype = [('ap', '|S50'), ('value', '|S20'), ('jahr', '|S10'), ('id', '|S10'), ('name', '|S50')]
np.set_printoptions(threshold=np.nan)

auslaender = np.loadtxt(csv, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)

auslaender = f.datasetPreprocessing(auslaender)

einpersonen = np.loadtxt(csv2, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
einpersonen = einpersonen[np.where(einpersonen['ap'] == 'Haushalte - gesamt')]
einpersonen = f.datasetPreprocessing(einpersonen)

lebenserwartung = np.loadtxt(csv3, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
lebenserwartung = lebenserwartung[np.where(lebenserwartung["ap"] == 'weiblich-gesamt')]
lebenserwartung = f.datasetPreprocessing(lebenserwartung)

dichte = np.loadtxt(csv4, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
dichte = f.datasetPreprocessing(dichte)

data = np.zeros((auslaender['id'].size,4))
data[:,0] = auslaender['value']
data[:,1] = einpersonen['value']
data[:,2] = lebenserwartung['value']
data[:,3] = dichte['value']

#zur kontrolle
#newdtype = [('id1', '|S10'), ('jahr1', 'i2'), ('value1', 'f8'), ('id2', '|S10'), ('jahr2', 'i2'), ('value2', 'f8')]
#new_struc = np.zeros(auslaender['id'].size, newdtype)
#new_struc['id1'] = auslaender['id']
#new_struc['id2'] = einpersonen['id']
#new_struc['jahr1'] = auslaender['jahr']
#new_struc['jahr2'] = einpersonen['jahr']
#new_struc['value1'] = auslaender['value']
#new_struc['value2'] = einpersonen['value']

print data
print np.corrcoef(data[:,0], data[:,1])
print np.corrcoef(data[:,1], data[:,2])
print np.corrcoef(data[:,0], data[:,2])

for col1 in xrange(0,data[0,:].size):
	for col2 in xrange(0,data[0,:].size):
		print "[{}|{}]: {}".format(col1,col2,np.corrcoef(data[:,col1], data[:,col2]))


	