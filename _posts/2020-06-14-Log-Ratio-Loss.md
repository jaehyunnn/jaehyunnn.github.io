---
layout: post
title: "Deep Metric Learning Beyond Binary Supervision 정리"
date:  2020-06-14
categories: Deep learning

---

## Deep Metric Learning Beyond Binary Supervision

---

CVPR 2019, Visual similarity 를 위한 metric learning 은 보통 binary supervision 을 이용 (postive pair, negative pair) 단순히 이러한 positive, negative 만을 구분하는 것은 실제 이미지들 간의 관계를 나타내기엔 매우 제한적임. 이런 문제를 해결하기 위해 continuous label 을 활용한 new triplet loss 를 제안한다.  

---

### Introduction

- 단순히 binary label 을 활용한 기존 metric learning 은 실제 이미지 relation 에서 극히 작은 부분에만 의존하여 학습하는 꼴이다.
- 이러한 방식의 metric learning 은 image caption, human pose, camera pose, scene graph 등과 같이 기존에 continuous label 을 활용한 task 들에서는 풍부한 이미지들간의 관계를 고려하지 못한다. 
- 그럼에도 이러한 continuous label 을 단순한 binary label 로 quantizing 하여 metric learning 을 적용해왔다.
- 이러한 문제를 다루기 위해, 이 논문에서는 metric learning 에서 continuous label 의 이점을 최대한 이용할 수 있는 new triplet loss 를 제안한다.
- 새로 제안하는 loss 는 label distance ratio 를 보존하도록 학습한다. 
- 결국 continuous label 을 활용하므로써, 좀 더 미세한 similarity 를 고려하도록 한다.
- 그리고 새로운 triplet sampling 기법을 제안하는데, 기존 triplet sampling 과 달리 주어진 mini-batch 내에서 가능한 모든 pair 를 고려하고 따로 binary label 로 qunatization 하는 과정없이 진행된다. (그냥 기존에 존재하는 continous label 을 활용하는 듯)

### Log-ratio Loss

이 논문에서 새롭게 제안하는 loss 를 'log-ratio loss' 라고 명명하였다. log space 에서의 거리 비율을 학습하기 때문인 것 같다. 수식은 다음과 같다:

<br><center>
$$
l_{lr}(a,i,j)=\{log\frac{D(f_{a},f_{i})}{D(f_{a},f_{j})}- log\frac{D(y_{a},y_{i})}{D(y_{a},y_{j})}\}^{2}
$$
<br>

수식을 직관적으로 설명해보면, anchor 와 이미지 j 의 거리와 anchor 와 이미지 i 의 거리 비율을 continuous label 로 주어진 거리 비율의 차이를 구해 loss 로 이용하는 거이다. 여기서 i 와 j 는 기존과 달리 positive/negative 를 구분하지 않는다.

이 loss 의 gradient 를 계산해보자:

<br><center>
$$
\frac{\partial{l_{lr}(a,i,j)}}{\partial{f_{i}}}=\frac{(f_{i}-f_{a})}{D(f_{a},f_{i})}\cdot l^{'}_{lr}(a,i,j)
$$
<br><center>
$$
\frac{\partial{l_{lr}(a,i,j)}}{\partial{f_{j}}}=\frac{(f_{a}-f_{j})}{D(f_{a},f_{j})}\cdot l^{'}_{lr}(a,i,j)
$$
<br><center>
$$
\frac{\partial{l_{lr}(a,i,j)}}{\partial{f_{a}}}=\frac{\partial{l_{lr}(a,i,j)}}{\partial{f_{i}}}-\frac{\partial{l_{lr}(a,i,j)}}{\partial{f_{j}}}
$$
<br>

여기서 $$l^{'}_{lr}(a,i,j)$$ 은 다음을 통해 계산된 scalar value 이다:

<br><center>
$$
l^{'}_{lr}(a,i,j)=4\{log\frac{D(f_{a},f_{i})}{D(f_{a},f_{j})}- log\frac{D(y_{a},y_{i})}{D(y_{a},y_{j})}\}
$$
<br>

log-ratio loss 의 또 하나의 장점을 말하자면, parameter-free 라는 점이다. 기존 triplet loss 같은 경우는 margin 과 같은 hyper-parameter 를 정해주어야하는데, log-ratio loss 는 거리 비율 자체를 학습하므로 그럴 필요가 없다는 것이다.

### Dense Triplet Mining

log-ratio loss 와 함께 triplet sample 을 뽑아낸 방식을 설명한다. 먼저 mini-batch $$B$$ 를 구성하는데 이 mini-batch 는 anchor 와 continuous label 을 기준으로 anchor 의 k-nearest neighbour 로 구성하고 나머지는 random 하게 sampling 을 한다. 여기서 **nearest neighbour 를 포함하는 것이 학습을 speed-up 시키는데 매우 효과적**이라고 한다. 상대적으로 nearest sample 은 label 로 주어진 거리가 작기 때문에 log-ratio 를 계산할때 큰 log-ratio 를 label 로 사용할 수 있게 된다.

이렇게 mini-batch 가 주어지면 모든 가능한 triplet pair 를 만든다. 물론 수식에서 보다시피 $$(a,i,j)$$ 와 $$(a,j,i)$$ 차이가 없기 때문에 이 두가지를 사용하게 되면 중복이 되는 셈이다. 이런 중복을 피하고자 $$D(y_{a},y_{i})<D(y_{a},y_{j})$$ 인 경우만 sampling 을 하였다. 

