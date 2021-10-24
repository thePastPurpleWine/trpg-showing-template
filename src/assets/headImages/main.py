import os

origin_file = open('data', mode='r', encoding='utf8')
target_file = open('data2', mode='w+', encoding='utf8')
qq_dict = {}

for line in origin_file.readlines():
    if line.find('2020') > 0:
        qq_name = line.split('2020')[0][:-1]
        if qq_dict.get(qq_name) is not True:
            qq_dict[qq_name] = True
            target_file.write(qq_name + '\n')

print(qq_dict)
