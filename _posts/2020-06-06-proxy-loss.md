---
layout: post
title: "Proxy Anchor Loss for Deep Metric Learning 정리"
date:  2020-06-06
categories: Deep learning
---

## Proxy Anchor Loss for Deep Metric Learning

---

CVPR 2020, 기존 metric learning 에서 사용되던 loss 를 1) pair-based loss 2) proxy-based loss 두 분류로 정의하고  pair-based loss 경우 data-point 간의 관계를 이용하지만, 너무 느리게 수렴한다는 단점이 있다. 반면 proxy-based loss 같은 경우 매우 빠르게 수렴하지만 data-to-data 관계를 풍부하게 고려하지못하는 단점이 있다. 이 논문에서는 이러한 각 카테고리별 loss 들의 한계점들을 극복한 new proxy-based loss 를 제안한다.

---

### Introduction

Proxy 라는 개념은 training data 의 subset을 대표하고 network parameter 의 한 부분을 학습한다. 이 개념은 "[No Fuss Distance Metric Learning using Proxies](http://openaccess.thecvf.com/content_ICCV_2017/papers/Movshovitz-Attias_No_Fuss_Distance_ICCV_2017_paper.pdf)" 이 논문에서 제안한 것인데, metric learning 에서 수렴이 매우 빠르게 된다는 것을 증명 하였다.

먼저 기존 논문에 따르면 data point 들을 proxy 라는 개념으로 재정의 하고 이 proxy를 활용해 학습을 진행한다. 이러한 시도를 한 이유는 pair 를 기반으로 학습하게 되면 all pair 를 보기 위해 엄청난 iteration을 돌아야 하기때문에 매우 수렴이 오래걸린다는 것이다.

결국 모든 datapoint를 근사하여 소량의 데이터로 이루어진 proxy를 만들고 이것으로 학습하여 빠르게 수렴하고 전체 datapoint를 보는 것과 다름 없는 성능이 나오게 한것이

![](https://media.arxiv-vanity.com/render-output/2790629/x2.png)

이 논문에서는 Proxy-Anchor loss 를 제안하는데, 이는 proxy 를 anchor 로 설정하고  proxy 와 같은 class 는 positive pair 로 끌어당기고 다른 class 는 negative pair 로 설정하여 밀어내는 방식으로 학습이 이루어진다.

### Method

#### Review of Proxy-NCA Loss

먼저 각 class 에 proxy 를 할당한다. 결국 proxy 의 개수와 class 의 개수가 같다. 그리고 input 으로 어떠한 anchor point 가 들어오면 이 anchor 와 같은 class의 proxy 는 positive 로 간주하고 다른 class의 proxy는 negative 로 간주하여 학습을 진행한다.  

positive proxy 는 $$p^{+}$$, negative proxy 는 $$p^{-}$$ 로 표현한 Proxy-NCA loss 는 다음과 같다:

<br><center>
$$
l(X)
=\sum_{x\in X}-log \frac{e^{s(x,p^{+})}}{\sum_{p^{-}\in P^{-}}s(s,p^{-})}
=\sum_{x\in X}\{-s(s,p^{+})+LSE_{p^{-}\in P^{-}}s(x,p^{-})\}
$$
<br>

여기선 cosine similarity $$s(*,*)$$ 를 사용하여 학습하였다. 그리고 $$LSE$$ 는 max function 의 soft 한 버전으로 볼 수 있는 Log-Sum-Exp function 을 나타낸다고 한다. 기존 $$M$$ 개의 데이터 내 pairwise sample 이나 triplet sample 은 $$O(M^2), O(M^3)$$ 을 고려해야 하지만 이러한 proxy를 class 개수 $$C$$ 만큼만 만들어 고려하면, $$O(MC)$$ 만 고려하면 되고 보통 $$C$$ 는 $$M$$ 에 비해 소량이기 때문에 훨씬 빠르게 학습이 가능한 것이다. 

사실 all pair 를 고려하는 것은 매우 비효율적이고 다양한 sampling 기법들 (hard negative, semi-hard negative mining 등) 을 활용하여 적당히 학습에 유의미할 수 있는 pair 만을 고려하는 방법있는데 이러한 heuristic 한 sampling 기법에 의존하지 않아도 되는 장점이 있다.

또한가지 장점으로는 어떠한 class 전체를 대표하는 proxy 이기 때문에 outlier 와 mislabeling 된 data point 등에 강인한 특성을 가진다.

이러한 장점에도 불구하고, 여전히 풍부히 이용할 수 있는 data-to-data 의 관계를 고려하지 못한다는 것은 큰 한계점으로 남는 연구였다.

### Proxy-Anchor Loss

위에서 언급한 Proxy-NCA loss 의 한계를 극복하기 위한 방안으로, Proxy point 를 anchor 로 사용하여 data-to-data relation 을 고려하는 방법을 제안한다:

<br><center>
$$
l(X)
=\frac{1}{|P^{+}|}\sum_{p\in P^{+}}log(1+\sum_{x\in X^{+}_{p}}e^{-\alpha(s(x,p)-\delta)})
+\frac{1}{|P|}\sum_{p\in P}(1+\sum_{x\in X^{-}_{p}}e^{\alpha (s(x,p)+\delta)})
$$
<br>

여기서 앞 term 은 positive 뒷 term 은 negative에 대한 부분이다. $$\delta>0$$ 은 margin 을 나타내고, $$\alpha>0$$ 는 scaling factor 이다. 

좀 알아보기 쉽게 간략이 쓰자면 다음과 같다:

<br><center>
$$
l(X)
=\frac{1}{|P^{+}|}\sum_{p\in P^{+}}[Softplus(LSE_{x\in X^{+}_{p}}-\alpha(s(x,p)-\delta)]
+\frac{1}{|P|}\sum_{p\in P}[Softplus(LSE_{x\in X^{-}_{p}}\alpha (s(x,p)+\delta))
$$
<br>

여기서 $$Softplus(z)=log(1+e^{z}), \forall z\in R $$ 이고, 보통 ReLU 의 soft 한 버전으로 알려져있다.

