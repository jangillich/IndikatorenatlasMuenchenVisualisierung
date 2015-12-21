import numpy as np

def datasetPreprocessing(a):

	for key in ['ap', 'name']:
		a[key] = [s.replace('\xc3\xb6', 'oe') for s in a[key]]
		a[key] = [s.replace('\xc3\xa4', 'ae') for s in a[key]]
		a[key] = [s.replace('\xc3\xbc', 'ue') for s in a[key]]

	a = a[np.where((a['id'] != '99') & (a['id'] != 'NUMMER'))]
	a = a[np.where(a['jahr'] != '2000')]
	a = a[np.where(a['jahr'] != '2001')]
	a = a[np.where(a['jahr'] != '2003')]
	a = a[np.where(a['jahr'] != '2012')]
	a['value'] = [s.replace(',' , '.') for s in a['value']]
	a['id'] = [s.replace('#100' , '100') for s in a['id']]

	a['id'] = [int(s) for s in a['id']]
	a['jahr'] = [int(s) for s in a['jahr']]
	a['value'] = [round(float(s),2) for s in a['value']]
	a = a.astype([('ap', '|S50'), ('value', 'f8'), ('jahr', 'i2'), ('id', 'i2'), ('name', '|S50')])

	a = np.sort(a, order=['id', 'jahr'])
	return a;