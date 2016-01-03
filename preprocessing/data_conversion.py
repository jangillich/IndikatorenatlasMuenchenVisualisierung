import numpy as np
import functions as f

import codecs




csv = "../csv/indikatorenatlas2014bevoelkerungauslaenderinnenanteil.csv"
csv2 = "../csv/indikatorenatlas2014bevoelkerungeinpersonenhaushalte.csv"
csv3 = "../csv/indikatorenatlas2014bevoelkerungmittlerelebenserwartung.csv"
csv4 = "../csv/indikatorenatlas2014bevoelkerungeinwohnerdichte.csv"
csv5 = "../csv/indikatorenatlas2014arbeitsmarktarbeitslosendichte.csv"
csv6 = "../csv/indikatorenatlas2014bevoelkerungaltersdurchschnitt.csv"
csv7 = "../csv/indikatorenatlas2014verkehrpersonenwagendichte.csv"

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

arbeitslosenquote = np.loadtxt(csv5, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
arbeitslosenquote = arbeitslosenquote[np.where(arbeitslosenquote['ap'] == 'gesamt')]
arbeitslosenquote = f.datasetPreprocessing(arbeitslosenquote)

alter = np.loadtxt(csv6, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
alter = alter[np.where(alter['ap'] == 'gesamt')]
alter = f.datasetPreprocessing(alter)

pkws = np.loadtxt(csv7, dtype=dtype, delimiter='","', comments='', usecols=(2,3,14,16,17), skiprows=0)
pkws = pkws[np.where(pkws['ap'] == 'privat')]
pkws = f.datasetPreprocessing(pkws)

data = np.zeros((auslaender['id'].size,7))
data[:,0] = auslaender['value']
data[:,1] = einpersonen['value']
data[:,2] = lebenserwartung['value']
data[:,3] = dichte['value']
data[:,4] = arbeitslosenquote['value']
data[:,5] = alter['value']
data[:,6] = pkws['value']

struc = np.zeros((data[:,0].size, data[0,:].size + 2))
struc[:,0] = alter['id']
struc[:,1] = alter['jahr']
struc[:,2:] = data

names = ['id', 'jahr', 'auslaender', 'einpersonen', 'lebenserwartung', 'dichte', 'arbeitslosenquote', 'alter', 'pkws']
formats = ['%i', '%i', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
np.savetxt("./results/data.csv", struc, delimiter=",", fmt=formats, header=','.join(names), comments='')

#zur kontrolle
#newdtype = [('id1', '|S10'), ('jahr1', 'i2'), ('value1', 'f8'), ('id2', '|S10'), ('jahr2', 'i2'), ('value2', 'f8')]
#new_struc = np.zeros(auslaender['id'].size, newdtype)
#new_struc['id1'] = auslaender['id']
#new_struc['id2'] = einpersonen['id']
#new_struc['jahr1'] = auslaender['jahr']
#new_struc['jahr2'] = einpersonen['jahr']
#new_struc['value1'] = auslaender['value']
#new_struc['value2'] = einpersonen['value']

#print data
correlation = np.corrcoef(data, rowvar=0)
np.savetxt("./results/correlation.csv", correlation, delimiter=",", fmt='%s')


	