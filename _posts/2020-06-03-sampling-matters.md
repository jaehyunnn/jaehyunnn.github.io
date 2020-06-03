---
layout: post
title:  "Sampling Matters in Deep Embedding Learning 정리"
date:   2020-06-03
categories: Deep learning
---

## Sampling Matters in Deep Embedding Learning 리뷰

---

<br>

ICCV 2017, metric leanring 혹은 embedding learning 이라는 분야에서 많은 연구들이 contrastive loss / triplet loss 처럼 loss function을 구성하는데만 열기를 띄는 것을 지적하며, ***'Distance weighted sampling'*** 기법을 제안하고 training sample을 어떻게 selecting 하는가도 매우 중요한 문제라는 것을 상기시켜 주었다. 

<br>

### 1   Introduction

논문에서 말하는 deep embedding(metric) learning의 core idea:

- Similar image (positive) 들은 가까워지게 pull (당김)
- Dissimilar image (negative) 들은 멀어지게 push(밀어냄)

특히 특정 fixed distance (margin) 를 기준으로 끌어당기고 밀어내고 하는데, 모든 sample 들에서 same fixed distance 를 사용하는 것은 매우 제한적이고, embedding space이 distortion 되지 못하게 한다는 점을 문제점으로 지적한다. 

아마 여기서 embedding space의 distortion은 학습되면서 embedding space가 변화하는 것을 이야기 하는 것 같다... (distortion이 부정적인 요소는 아닌듯)

Triplet sampling 을 이용한 metric learning 을 개선할 수 있는 방법 두가지:

1. Loss function 을 개선
2. Sampling 방법을 개선

이 논문에서는 Sampling 방법이 loss를 만드는 것보다 더 중요하다고 주장하고 이를 relative distance 에 따라서 unform 하게 뽑히는 sampling 을 제안한다.

여기서 제안한는 sampling 기법을 사용했을때, 어떤 loss function을 사용하였을때라도 loss 의 variance가 낮아졌고 보다 안정적인 학습과 성능을 보여주었다.

추가적으로 contrastive loss 의 확장판인 simple margin-based loss 를 제안한다. 이 loss funciton 으로 더 loss 가 안정되고 모델이 robust 하게된다고 주장한다. 추가적으로 isotonic regression (등위회기) 를 사용하는데, absolute distance (절대거리) 대신 relative orders (상대적인 순서) 에 focus하는 효과가 있다고 한다.

결국 margin based loss + distance weighted sampling 기법으로 SOTA 성능을 달성 했다고 한다.

<br>

### 2   Related Work

#### Metric learning network 와 loss function 들

Siamese architecture 의 등장 --> 당시 computational power 가 부족했던점, non-convex 한 성질 등으로 주목받지 못함 --> computeational power에 대한 문제가 해결되고 Triplet loss 같은 convex 한 방법론들이 등장 --> Siamese architecture 가 많이 적용됨 --> Quadruplet sample 을 이용한 방법, batch 내 모든 데이터를 고려하여 pair를 만들어 학습하는 n-pair loss 등이 등장함

"IntervalRank: Isotonic regression with listwise and pairwise constraints." 라는 논문에서  ***Isotonic regression***를 가져오는데, pariwise 한 비교들을 분리하는 알고리즘으로 매우 효율적인 computational 효율성을 보인다고 한다.

#### Example selection techniques

상대적으로 매우 적은 연구가 이루어졌음. Contrastive loss 에서는 그냥 가능한 모든 pair를 random 하게 sampling 하거나, 가끔씩 hard negative mining을 진행하곤 하였다. Triplet loss 에서는 FaceNet 에서 처음으로 semi-negative mining 을 적용 (mini-batch 내에서 hardest negative sample 로 학습을 진행하면, local minima에 빠지게 되었어 semi-hard negative sampling을 하였다고 한다.) 

여기서 semi-hard negative mining을 간단히 설명하자면,

1. mini-batch 내에서 positive set을 구함
2. anchor 와 positive 사이 거리를 구함
3. negative 들 중에서 positive set의 거리보다 가깝게 나오는 모든 negative set 학습

만약 mini-batch 가 작아서 이러한 semi-hard 에 해당하는 negative sample 이 없다면 먼저 1) easy negative로 학습(이 batch는 학습하지 않겠다는 의미인듯), 이마저도 없으면   2) hardest negative 로 학습

이 논문에서는 sampling r기법에 따라서 embedding/metric learning 성능에 영향을 미치는지를 보여준다.

<br>

### 3   Preliminaries

$ f(x_i) $ 는 $x_i$ 의 embedding point 이고 $f:R^N \rightarrow R^D$ 인 deep network 라고 하자. 보통 embedding 된 point $f(x_i)$ 는 학습의 stability 를 위하여 L2-normalize 되어 unit length 를 가지게 된다. 

여기서 각 similar data 들의 embedding point 는 가까워지고, dissimilar data 들의 embedding point 는 멀어지도록 목적하는 함수들은 다음과 같다.
$$
l^{contrast}(i,j):=y_{ij}D^{2}_{ij}+(1-y_{ij})[\alpha - D_{ij}]^{2}_{+}
$$

$$
l^{triplet}(a,p,n):=[D_{ap}^{2}-D_{an}^{2}+\alpha]_{+}
$$

순서대로 contrastive, triplet loss 이다. 여기서 margin $\alpha$ 를 기준으로 두고 embedding space가 distortion 되도록 학습하는 것이다.

여기서 빠르게 수렴할 수 있도록 몇가지 heuristic한 방법들을 사용하는데 sampling 방법이 그 중 하나가 될 수 있다. contrastive loss 에서는 hard negative mining 을 적용했을때 대부분 빠르게 수렴하는 편이지만, triplet loss 에서는 종종 hard negative mining 때문에 모델이 망가지는 경우들을 보면 수렴이 빠르다는 것이 확실치 못한 편이다.

그래서 FaceNet 에서 semi-hard negative mining 을 제안한 것이다: 
$$
n^{*}_{ap}:=argmin_{n:D(a,n)>D(a,p)}D_{an}
$$
결국, positive point와의 거리보다 멀리있는 negative point들 중에서 hardest 한걸 채택하는 방식이다 (물론 mini-batch 내에서 이루어짐). --> 이러한 방식은 어려운 negative를 채택하지만 너~~~무 어렵지 않은 semi-hard negative 이다.

암튼 이 논문에서는 기존 sampling 기법들이 다소 heuristic 한 방법으로 sample 들에 weighting을 함으로써 좋은 성능을 가져왔는데, 어떠한 이유로 이런 성능향상이 일어났는지 분석하고, 새로운 sampling 기법을 제안하고자 한다.

<br>

### 4   Distance Weighted Margin-Based Loss

먼저 negative 를 uniform 하게 sampling 할때 어떤 일이 발생하는지 이해하기 위해, embedding space 는 n-차원 (보통 n>128)의 unit sphere $S^{n-1}$ 라는 것을 언급한다. 이 경우에 pariwise distance 들은 다음과 같이 일반화 할 수 있다:
$$
q(d)\propto d^{n-2}[1-\frac{1}{4}d^{2}]^{\frac{n-3}{2}}
$$
"*The sphere game in n dimensions. http://faculty.madisoncollege.edu/alehnen/sphere/hypers.htm. Accessed: 2017-02-22.*" 에 유도식이 나온다지만 일단 넘어가고, 결론적으로는 만약 negative sample 들이 uniform 하게 찍히고, 우리는 그것들을 random 하게 뽑아버리면, 우리는 $\sqrt{2}$-가지의 sample을 얻을 수 있다는 것이다.  여기서 threshold 를 $\sqrt{2}$ 보다 낮게 하면, loss 는 생기지 않을 것이고 더 이상 학습이 되지 않게 된다.

![](https://ai2-s2-public.s3.amazonaws.com/figures/2017-08-08/854565e4ec4dda69d1d5587ef9d7c122726816ab/3-Figure2-1.png)

위 그래프는 D-dimensional unit sphere 에서 datapoint 들에 대한 density를 보여준다. 대부분의 dimension 들이 비슷한 양상을 나타낸다. 

![](https://miro.medium.com/max/2244/1*Ajj6Q52QvexZ_cudqqdr_A.png)

위 그림 (a) 에서 보다시피, 논문에서 관찰한 바로는 anchor 와 negative 의 거리가 너무 가까운것을 사용하면 gradient의 variance가 너무 커지고 noise ratio에 low-signal을 가짐. 동시에, random 하게 sampling하면 good signal에서는 너무 자주 벗어나게됨.

#### Distance weighted sampling

이러한 문제를 고려하고자 논문에서는 variance 를 잘 control 하는 동시에 bias 를 고친 새로운 sampling distribution 을 제안한다. 

상세히 설명하자면, 먼저 distance 에 따라서 uniform 하게 sampling 함 (즉, $q(d)^{-1}$의 weight로 sampling) --> 한 군데 몰려있는 sample 이 아니라 골고루 잘 퍼진 sample 들을 얻을 수 있다. 수식적으로 이러한 distance weighted sampling 은 다음과 같다:
$$
Pr(n^{*}=n|a) \propto min(\lambda, q^{-1}(D_{an}))
$$
위 그림 (b)는 gradient 의 variance 에 따라 달라지는 strategy 로 부터 추출 되는 sample 들을 비교한다. Hard negative 는 항상 high variance  region 에서의 sample 을 제공한다. --> 이렇게 되면 anchor 와 negative 가 멀어 지도록 학습 할 수 없는 noisy 한 gradient 가 나오게 된다. 그 결과로 model 이 망가지게 되는 것이다.



