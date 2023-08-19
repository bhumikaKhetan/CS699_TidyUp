import matplotlib.pyplot as plt
import numpy as np
# import seaborn
# plt.style.use('_mpl-gallery')
plt.autoscale(enable=True)
def bar_graph(labels, values, image_name, column_name):
       plt.clf()
       x_label = np.arange(0, len(labels))
       plt.bar(x_label, values, bottom=None)  # align = "center"
       for index, value in zip(x_label, values):
              plt.text(index, value,
                       str(value), ha='center')
       plt.xticks(x_label, labels, rotation=90)
       plt.xlabel(column_name)
       plt.savefig(image_name, bbox_inches='tight', dpi=100)


def pie_graph(labels, values, image_name,column_name):
       plt.clf()
       patches,texts,das = plt.pie(values,labels = labels, autopct='%.0f%%')  # align = "center"
       # plt.legend(patches, labels, loc="center")
       plt.xlabel(column_name)

       # palette_color = seaborn.color_palette("deep")

       # plotting data on chart
       # patches = plt.pie(values,  colors=palette_color,
       #          autopct='%.0f%%')
       # plt.legend(patches, labels, loc="best")
       plt.savefig(image_name, bbox_inches='tight')


def histograms(x, bins, image_name, data_frame, column_name):
       # plot:
       plt.clf()
       data_type = data_frame[column_name].dtype
       if data_type.kind in "iufc":
              min_val = min(x)
              max_val = max(x)
              print(min_val)
              print(max_val)
              plt.hist(x, range=[min_val,max_val],  linewidth=0.5, edgecolor="white")
       else:
              plt.hist(x, linewidth=0.5, edgecolor="white")
              plt.xticks(rotation='vertical')

       # ax.set(xlim=(0, 8), xticks=np.arange(1, 8),
       #        ylim=(0, 56), yticks=np.linspace(0, 56, 9))
       plt.xlabel(column_name)
       plt.savefig(image_name, bbox_inches='tight', dpi=100)